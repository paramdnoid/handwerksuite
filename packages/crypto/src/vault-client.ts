import type { VaultConfig } from "./types";

interface TransitEncryptResult {
  ciphertext: string;
  keyVersion: number;
}

interface TransitKeyOptions {
  type: string;
  exportable: boolean;
  allowPlaintextBackup: boolean;
  autoRotatePeriod?: string;
}

/**
 * Client for OpenBao (HashiCorp Vault fork) Transit Secret Engine.
 * Handles all key management operations via the Transit API.
 */
export class VaultClient {
  private address: string;
  private token: string;
  private transitMount: string;

  constructor(config: VaultConfig) {
    this.address = config.address.replace(/\/$/, "");
    this.token = config.token;
    this.transitMount = config.transitMountPath ?? "transit";
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.address}/v1/${path}`;
    const response = await fetch(url, {
      method,
      headers: {
        "X-Vault-Token": this.token,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Vault request failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  async createTransitKey(
    name: string,
    options: TransitKeyOptions,
  ): Promise<void> {
    await this.request("POST", `${this.transitMount}/keys/${name}`, {
      type: options.type,
      exportable: options.exportable,
      allow_plaintext_backup: options.allowPlaintextBackup,
      auto_rotate_period: options.autoRotatePeriod,
    });
  }

  async rotateTransitKey(name: string): Promise<void> {
    await this.request("POST", `${this.transitMount}/keys/${name}/rotate`);
  }

  async transitEncrypt(
    keyName: string,
    plaintext: Buffer,
  ): Promise<TransitEncryptResult> {
    const result = await this.request<{
      data: { ciphertext: string; key_version: number };
    }>("POST", `${this.transitMount}/encrypt/${keyName}`, {
      plaintext: plaintext.toString("base64"),
    });

    return {
      ciphertext: result.data.ciphertext,
      keyVersion: result.data.key_version,
    };
  }

  async transitDecrypt(ciphertext: string): Promise<Buffer> {
    const keyName = this.extractKeyNameFromCiphertext(ciphertext);
    const result = await this.request<{
      data: { plaintext: string };
    }>("POST", `${this.transitMount}/decrypt/${keyName}`, {
      ciphertext,
    });

    return Buffer.from(result.data.plaintext, "base64");
  }

  async deleteTransitKey(name: string): Promise<void> {
    // Must first allow deletion
    await this.request("POST", `${this.transitMount}/keys/${name}/config`, {
      deletion_allowed: true,
    });
    await this.request("DELETE", `${this.transitMount}/keys/${name}`);
  }

  private extractKeyNameFromCiphertext(ciphertext: string): string {
    // OpenBao ciphertext format: vault:v{version}:{base64data}
    // The key name is embedded in the API call context
    const parts = ciphertext.split(":");
    if (parts.length < 3 || parts[0] !== "vault") {
      throw new Error("Invalid ciphertext format");
    }
    return parts[0]; // Actual routing handled by Transit engine
  }
}

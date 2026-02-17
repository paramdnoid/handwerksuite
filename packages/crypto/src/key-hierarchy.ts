import { VaultClient } from "./vault-client";
import { tenantKeyName } from "./aad";
import type { VaultConfig } from "./types";

/**
 * Manages the multi-level key hierarchy:
 *
 * Master Key (in OpenBao/HSM)
 *   └── KEK (Key Encryption Key) – per tenant, managed by OpenBao Transit
 *       └── DEK (Data Encryption Key) – per record/field, encrypted by KEK
 */
export class KeyHierarchy {
  private vault: VaultClient;

  constructor(config: VaultConfig) {
    this.vault = new VaultClient(config);
  }

  /**
   * Provisions a new KEK for a tenant in OpenBao Transit.
   * Called during tenant onboarding.
   */
  async provisionTenantKey(tenantId: string): Promise<void> {
    const keyName = tenantKeyName(tenantId);
    await this.vault.createTransitKey(keyName, {
      type: "aes256-gcm96",
      exportable: false,
      allowPlaintextBackup: false,
      autoRotatePeriod: "90d",
    });
  }

  /**
   * Rotates a tenant's KEK. Existing DEKs remain valid
   * (OpenBao Transit supports versioned decryption).
   */
  async rotateTenantKey(tenantId: string): Promise<void> {
    const keyName = tenantKeyName(tenantId);
    await this.vault.rotateTransitKey(keyName);
  }

  /**
   * Wraps (encrypts) a DEK using the tenant's KEK via OpenBao Transit.
   */
  async wrapDEK(
    tenantId: string,
    dek: Buffer,
  ): Promise<{ encryptedDek: string; dekVersion: number }> {
    const keyName = tenantKeyName(tenantId);
    const result = await this.vault.transitEncrypt(keyName, dek);
    return {
      encryptedDek: result.ciphertext,
      dekVersion: result.keyVersion,
    };
  }

  /**
   * Unwraps (decrypts) a DEK using the tenant's KEK via OpenBao Transit.
   */
  async unwrapDEK(tenantId: string, encryptedDek: string): Promise<Buffer> {
    const _keyName = tenantKeyName(tenantId);
    return this.vault.transitDecrypt(encryptedDek);
  }

  /**
   * Deletes a tenant's KEK. IRREVERSIBLE – all encrypted data becomes unrecoverable.
   * Use only for tenant offboarding / data deletion (DSGVO Art. 17).
   */
  async destroyTenantKey(tenantId: string): Promise<void> {
    const keyName = tenantKeyName(tenantId);
    await this.vault.deleteTransitKey(keyName);
  }
}

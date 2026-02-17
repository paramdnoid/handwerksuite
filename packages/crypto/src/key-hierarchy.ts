import { VaultClient } from "./vault-client";
import { companyKeyName } from "./aad";
import type { VaultConfig } from "./types";

/**
 * Manages the multi-level key hierarchy:
 *
 * Master Key (in OpenBao/HSM)
 *   +-- KEK (Key Encryption Key) -- per company, managed by OpenBao Transit
 *       +-- DEK (Data Encryption Key) -- per record/field, encrypted by KEK
 */
export class KeyHierarchy {
  private vault: VaultClient;

  constructor(config: VaultConfig) {
    this.vault = new VaultClient(config);
  }

  /**
   * Provisions a new KEK for a company in OpenBao Transit.
   * Called during company onboarding.
   */
  async provisionCompanyKey(companyId: string): Promise<void> {
    const keyName = companyKeyName(companyId);
    await this.vault.createTransitKey(keyName, {
      type: "aes256-gcm96",
      exportable: false,
      allowPlaintextBackup: false,
      autoRotatePeriod: "90d",
    });
  }

  /**
   * Rotates a company's KEK. Existing DEKs remain valid
   * (OpenBao Transit supports versioned decryption).
   */
  async rotateCompanyKey(companyId: string): Promise<void> {
    const keyName = companyKeyName(companyId);
    await this.vault.rotateTransitKey(keyName);
  }

  /**
   * Wraps (encrypts) a DEK using the company's KEK via OpenBao Transit.
   */
  async wrapDEK(
    companyId: string,
    dek: Buffer,
  ): Promise<{ encryptedDek: string; dekVersion: number }> {
    const keyName = companyKeyName(companyId);
    const result = await this.vault.transitEncrypt(keyName, dek);
    return {
      encryptedDek: result.ciphertext,
      dekVersion: result.keyVersion,
    };
  }

  /**
   * Unwraps (decrypts) a DEK using the company's KEK via OpenBao Transit.
   */
  async unwrapDEK(companyId: string, encryptedDek: string): Promise<Buffer> {
    const _keyName = companyKeyName(companyId);
    return this.vault.transitDecrypt(encryptedDek);
  }

  /**
   * Deletes a company's KEK. IRREVERSIBLE -- all encrypted data becomes unrecoverable.
   * Use only for company offboarding / data deletion (DSGVO Art. 17).
   */
  async destroyCompanyKey(companyId: string): Promise<void> {
    const keyName = companyKeyName(companyId);
    await this.vault.deleteTransitKey(keyName);
  }
}

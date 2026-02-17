export interface EncryptedEnvelope {
  /** AES-256-GCM initialization vector (12 bytes, base64) */
  iv: string;
  /** Encrypted data (base64) */
  ciphertext: string;
  /** GCM authentication tag (16 bytes, base64) */
  authTag: string;
  /** KEK-encrypted DEK from OpenBao Transit (base64) */
  encryptedDek: string;
  /** Key version used for encryption */
  dekVersion: number;
  /** Algorithm identifier */
  algorithm: "aes-256-gcm";
  /** Envelope format version */
  version: 1;
}

export interface EncryptionContext {
  companyId: string;
  recordId: string;
  fieldName: string;
}

export interface KeyInfo {
  name: string;
  version: number;
  createdAt: Date;
  rotatedAt: Date | null;
}

export interface VaultConfig {
  address: string;
  token: string;
  transitMountPath?: string;
}

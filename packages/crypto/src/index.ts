export { encryptField, decryptField } from "./envelope";
export { buildAAD, verifyAAD } from "./aad";
export { KeyHierarchy } from "./key-hierarchy";
export { VaultClient } from "./vault-client";
export type {
  EncryptedEnvelope,
  EncryptionContext,
  KeyInfo,
} from "./types";

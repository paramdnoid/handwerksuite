import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";
import { buildAAD } from "./aad";
import { KeyHierarchy } from "./key-hierarchy";
import type { EncryptedEnvelope, EncryptionContext } from "./types";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV for GCM (NIST recommended)
const DEK_LENGTH = 32; // 256-bit DEK
const AUTH_TAG_LENGTH = 16; // 128-bit authentication tag

/**
 * Encrypts a field value using AES-256-GCM Envelope Encryption.
 *
 * Flow:
 * 1. Generate a random DEK (Data Encryption Key)
 * 2. Build AAD from tenant/record/field context
 * 3. Encrypt plaintext with AES-256-GCM using DEK + AAD
 * 4. Encrypt DEK with KEK via OpenBao Transit (envelope)
 * 5. Securely wipe DEK from memory
 * 6. Return encrypted envelope
 */
export async function encryptField(
  keyHierarchy: KeyHierarchy,
  context: EncryptionContext,
  plaintext: Buffer,
): Promise<EncryptedEnvelope> {
  // 1. Generate random DEK
  const dek = randomBytes(DEK_LENGTH);

  try {
    // 2. Build AAD for cross-tenant protection
    const aad = buildAAD(context.tenantId, context.recordId, context.fieldName);

    // 3. Encrypt with AES-256-GCM
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, dek, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    cipher.setAAD(aad);

    const ciphertext = Buffer.concat([
      cipher.update(plaintext),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    // 4. Encrypt DEK with KEK via OpenBao Transit
    const { encryptedDek, dekVersion } = await keyHierarchy.wrapDEK(
      context.tenantId,
      dek,
    );

    return {
      iv: iv.toString("base64"),
      ciphertext: ciphertext.toString("base64"),
      authTag: authTag.toString("base64"),
      encryptedDek,
      dekVersion,
      algorithm: ALGORITHM,
      version: 1,
    };
  } finally {
    // 5. Securely wipe DEK from memory
    dek.fill(0);
  }
}

/**
 * Decrypts a field value from an encrypted envelope.
 *
 * Flow:
 * 1. Unwrap DEK from KEK via OpenBao Transit
 * 2. Rebuild AAD from context
 * 3. Decrypt with AES-256-GCM (AAD mismatch = auth failure = cross-tenant block)
 * 4. Securely wipe DEK from memory
 */
export async function decryptField(
  keyHierarchy: KeyHierarchy,
  context: EncryptionContext,
  envelope: EncryptedEnvelope,
): Promise<Buffer> {
  if (envelope.version !== 1) {
    throw new Error(`Unsupported envelope version: ${envelope.version}`);
  }

  // 1. Unwrap DEK
  const dek = await keyHierarchy.unwrapDEK(
    context.tenantId,
    envelope.encryptedDek,
  );

  try {
    // 2. Rebuild AAD
    const aad = buildAAD(context.tenantId, context.recordId, context.fieldName);

    // 3. Decrypt
    const decipher = createDecipheriv(
      ALGORITHM,
      dek,
      Buffer.from(envelope.iv, "base64"),
      { authTagLength: AUTH_TAG_LENGTH },
    );
    decipher.setAAD(aad);
    decipher.setAuthTag(Buffer.from(envelope.authTag, "base64"));

    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(envelope.ciphertext, "base64")),
      decipher.final(), // Throws on AAD mismatch → cross-tenant protection
    ]);

    return plaintext;
  } finally {
    // 4. Securely wipe DEK
    dek.fill(0);
  }
}

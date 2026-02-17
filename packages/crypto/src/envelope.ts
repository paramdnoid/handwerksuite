import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";
import { buildAAD } from "./aad";
import { KeyHierarchy } from "./key-hierarchy";
import type { EncryptedEnvelope, EncryptionContext } from "./types";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const DEK_LENGTH = 32;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypts a field value using AES-256-GCM Envelope Encryption.
 *
 * Flow:
 * 1. Generate a random DEK (Data Encryption Key)
 * 2. Build AAD from company/record/field context
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
  const dek = randomBytes(DEK_LENGTH);

  try {
    const aad = buildAAD(context.companyId, context.recordId, context.fieldName);

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

    const { encryptedDek, dekVersion } = await keyHierarchy.wrapDEK(
      context.companyId,
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
    dek.fill(0);
  }
}

/**
 * Decrypts a field value from an encrypted envelope.
 *
 * Flow:
 * 1. Unwrap DEK from KEK via OpenBao Transit
 * 2. Rebuild AAD from context
 * 3. Decrypt with AES-256-GCM (AAD mismatch = auth failure = cross-company block)
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

  const dek = await keyHierarchy.unwrapDEK(
    context.companyId,
    envelope.encryptedDek,
  );

  try {
    const aad = buildAAD(context.companyId, context.recordId, context.fieldName);

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
      decipher.final(),
    ]);

    return plaintext;
  } finally {
    dek.fill(0);
  }
}

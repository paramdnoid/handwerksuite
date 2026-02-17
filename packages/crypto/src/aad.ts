import { createHash } from "node:crypto";

/**
 * Builds Additional Authenticated Data (AAD) for AES-256-GCM.
 * The AAD binds the ciphertext to a specific tenant, record, and field,
 * preventing cross-tenant data access even if DEKs are compromised.
 */
export function buildAAD(
  tenantId: string,
  recordId: string,
  fieldName: string,
): Buffer {
  const canonical = `v1:${tenantId}:${recordId}:${fieldName}`;
  return Buffer.from(canonical, "utf-8");
}

/**
 * Verifies that the AAD matches the expected context.
 * Used before decryption to ensure the caller has the correct context.
 */
export function verifyAAD(
  aad: Buffer,
  tenantId: string,
  recordId: string,
  fieldName: string,
): boolean {
  const expected = buildAAD(tenantId, recordId, fieldName);
  if (aad.length !== expected.length) return false;
  return aad.every((byte, i) => byte === expected[i]);
}

/**
 * Creates a deterministic key name for a tenant's KEK in OpenBao Transit.
 */
export function tenantKeyName(tenantId: string): string {
  const hash = createHash("sha256")
    .update(tenantId)
    .digest("hex")
    .slice(0, 12);
  return `tenant-${hash}-kek`;
}

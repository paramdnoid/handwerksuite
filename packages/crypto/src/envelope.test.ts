import { describe, it, expect, vi, beforeEach } from 'vitest';
import { encryptField, decryptField } from './envelope';
import type { EncryptionContext } from './types';
import { KeyHierarchy } from './key-hierarchy';

// Mock KeyHierarchy
vi.mock('./key-hierarchy', () => {
  return {
    KeyHierarchy: vi.fn().mockImplementation(() => ({
      wrapDEK: vi.fn().mockResolvedValue({
        encryptedDek: 'vault:v1:mock-encrypted-dek',
        dekVersion: 1,
      }),
      unwrapDEK: vi.fn(),
    })),
  };
});

describe('envelope encryption', () => {
  let keyHierarchy: KeyHierarchy;
  let context: EncryptionContext;

  beforeEach(() => {
    keyHierarchy = new KeyHierarchy({
      address: 'http://localhost:8200',
      token: 'test-token',
    });
    context = {
      companyId: 'company-123',
      recordId: 'record-456',
      fieldName: 'email',
    };
  });

  describe('encryptField', () => {
    it('should encrypt plaintext and return an envelope', async () => {
      const plaintext = Buffer.from('test@example.com');
      const envelope = await encryptField(keyHierarchy, context, plaintext);

      expect(envelope).toHaveProperty('iv');
      expect(envelope).toHaveProperty('ciphertext');
      expect(envelope).toHaveProperty('authTag');
      expect(envelope).toHaveProperty('encryptedDek');
      expect(envelope).toHaveProperty('dekVersion');
      expect(envelope.algorithm).toBe('aes-256-gcm');
      expect(envelope.version).toBe(1);
    });

    it('should produce base64-encoded values', async () => {
      const plaintext = Buffer.from('secret data');
      const envelope = await encryptField(keyHierarchy, context, plaintext);

      // Verify base64 encoding by attempting to decode
      expect(() => Buffer.from(envelope.iv, 'base64')).not.toThrow();
      expect(() => Buffer.from(envelope.ciphertext, 'base64')).not.toThrow();
      expect(() => Buffer.from(envelope.authTag, 'base64')).not.toThrow();
    });

    it('should produce a 12-byte IV', async () => {
      const plaintext = Buffer.from('test data');
      const envelope = await encryptField(keyHierarchy, context, plaintext);

      const iv = Buffer.from(envelope.iv, 'base64');
      expect(iv.length).toBe(12);
    });

    it('should produce a 16-byte auth tag', async () => {
      const plaintext = Buffer.from('test data');
      const envelope = await encryptField(keyHierarchy, context, plaintext);

      const authTag = Buffer.from(envelope.authTag, 'base64');
      expect(authTag.length).toBe(16);
    });

    it('should produce different ciphertext for same plaintext (random IV)', async () => {
      const plaintext = Buffer.from('same data');
      const envelope1 = await encryptField(keyHierarchy, context, plaintext);
      const envelope2 = await encryptField(keyHierarchy, context, plaintext);

      expect(envelope1.iv).not.toBe(envelope2.iv);
      expect(envelope1.ciphertext).not.toBe(envelope2.ciphertext);
    });

    it('should call wrapDEK with company ID', async () => {
      const plaintext = Buffer.from('test');
      await encryptField(keyHierarchy, context, plaintext);

      expect(keyHierarchy.wrapDEK).toHaveBeenCalledWith('company-123', expect.any(Buffer));
    });

    it('should handle empty plaintext', async () => {
      const plaintext = Buffer.from('');
      const envelope = await encryptField(keyHierarchy, context, plaintext);

      expect(envelope.ciphertext).toBeDefined();
      expect(envelope.version).toBe(1);
    });

    it('should handle large plaintext', async () => {
      const plaintext = Buffer.alloc(10000, 'x');
      const envelope = await encryptField(keyHierarchy, context, plaintext);

      expect(envelope.ciphertext).toBeDefined();
    });
  });

  describe('decryptField', () => {
    it('should decrypt an envelope back to original plaintext', async () => {
      const originalPlaintext = Buffer.from('test@example.com');

      // We need to capture the actual DEK used during encryption
      let capturedDek: Buffer | undefined;
      vi.mocked(keyHierarchy.wrapDEK).mockImplementation(
        async (_companyId: string, dek: Buffer) => {
          capturedDek = Buffer.from(dek); // copy before it gets wiped
          return { encryptedDek: 'vault:v1:wrapped', dekVersion: 1 };
        },
      );

      const envelope = await encryptField(keyHierarchy, context, originalPlaintext);

      // Mock unwrapDEK to return the captured DEK
      vi.mocked(keyHierarchy.unwrapDEK).mockResolvedValue(capturedDek!);

      const decrypted = await decryptField(keyHierarchy, context, envelope);
      expect(decrypted.toString()).toBe('test@example.com');
    });

    it('should reject unsupported envelope version', async () => {
      const envelope = {
        iv: 'dGVzdA==',
        ciphertext: 'dGVzdA==',
        authTag: 'dGVzdA==',
        encryptedDek: 'vault:v1:test',
        dekVersion: 1,
        algorithm: 'aes-256-gcm' as const,
        version: 2 as unknown as 1, // Force wrong version
      };

      await expect(decryptField(keyHierarchy, context, envelope)).rejects.toThrow(
        'Unsupported envelope version',
      );
    });

    it('should fail with wrong AAD context (cross-company protection)', async () => {
      let capturedDek: Buffer | undefined;
      vi.mocked(keyHierarchy.wrapDEK).mockImplementation(
        async (_companyId: string, dek: Buffer) => {
          capturedDek = Buffer.from(dek);
          return { encryptedDek: 'vault:v1:wrapped', dekVersion: 1 };
        },
      );

      const envelope = await encryptField(keyHierarchy, context, Buffer.from('secret'));

      vi.mocked(keyHierarchy.unwrapDEK).mockResolvedValue(capturedDek!);

      // Try to decrypt with different company context
      const wrongContext: EncryptionContext = {
        companyId: 'other-company',
        recordId: 'record-456',
        fieldName: 'email',
      };

      await expect(decryptField(keyHierarchy, wrongContext, envelope)).rejects.toThrow(); // GCM auth failure
    });

    it('should roundtrip encrypt/decrypt with unicode data', async () => {
      const originalPlaintext = Buffer.from('Straße 42, München – Wärmedämmung');

      let capturedDek: Buffer | undefined;
      vi.mocked(keyHierarchy.wrapDEK).mockImplementation(
        async (_companyId: string, dek: Buffer) => {
          capturedDek = Buffer.from(dek);
          return { encryptedDek: 'vault:v1:wrapped', dekVersion: 1 };
        },
      );

      const envelope = await encryptField(keyHierarchy, context, originalPlaintext);
      vi.mocked(keyHierarchy.unwrapDEK).mockResolvedValue(capturedDek!);

      const decrypted = await decryptField(keyHierarchy, context, envelope);
      expect(decrypted.toString('utf-8')).toBe('Straße 42, München – Wärmedämmung');
    });
  });
});

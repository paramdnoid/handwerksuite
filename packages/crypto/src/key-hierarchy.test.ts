import { describe, it, expect, vi, beforeEach } from 'vitest';
import { KeyHierarchy } from './key-hierarchy';
import { VaultClient } from './vault-client';
import { companyKeyName } from './aad';

vi.mock('./vault-client', () => {
  return {
    VaultClient: vi.fn().mockImplementation(() => ({
      createTransitKey: vi.fn().mockResolvedValue(undefined),
      rotateTransitKey: vi.fn().mockResolvedValue(undefined),
      transitEncrypt: vi.fn().mockResolvedValue({
        ciphertext: 'vault:v1:encrypted-dek',
        keyVersion: 1,
      }),
      transitDecrypt: vi.fn().mockResolvedValue(Buffer.from('decrypted-dek')),
      deleteTransitKey: vi.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('KeyHierarchy', () => {
  let hierarchy: KeyHierarchy;
  let mockVault: ReturnType<typeof vi.mocked<VaultClient>>;

  beforeEach(() => {
    vi.clearAllMocks();
    hierarchy = new KeyHierarchy({
      address: 'http://localhost:8200',
      token: 'test-token',
    });
    // Access the mock vault instance
    mockVault = vi.mocked(VaultClient).mock.results[0]!.value;
  });

  describe('provisionCompanyKey', () => {
    it('should create a transit key with correct parameters', async () => {
      await hierarchy.provisionCompanyKey('company-123');

      const expectedKeyName = companyKeyName('company-123');
      expect(mockVault.createTransitKey).toHaveBeenCalledWith(expectedKeyName, {
        type: 'aes256-gcm96',
        exportable: false,
        allowPlaintextBackup: false,
        autoRotatePeriod: '90d',
      });
    });

    it('should use deterministic key name', async () => {
      await hierarchy.provisionCompanyKey('company-123');
      await hierarchy.provisionCompanyKey('company-123');

      const calls = vi.mocked(mockVault.createTransitKey).mock.calls;
      expect(calls[0]![0]).toBe(calls[1]![0]);
    });
  });

  describe('rotateCompanyKey', () => {
    it('should rotate the transit key', async () => {
      await hierarchy.rotateCompanyKey('company-123');

      const expectedKeyName = companyKeyName('company-123');
      expect(mockVault.rotateTransitKey).toHaveBeenCalledWith(expectedKeyName);
    });
  });

  describe('wrapDEK', () => {
    it('should encrypt DEK with company KEK', async () => {
      const dek = Buffer.from('random-dek-bytes');
      const result = await hierarchy.wrapDEK('company-123', dek);

      expect(result.encryptedDek).toBe('vault:v1:encrypted-dek');
      expect(result.dekVersion).toBe(1);

      const expectedKeyName = companyKeyName('company-123');
      expect(mockVault.transitEncrypt).toHaveBeenCalledWith(expectedKeyName, dek);
    });
  });

  describe('unwrapDEK', () => {
    it('should decrypt encrypted DEK', async () => {
      const result = await hierarchy.unwrapDEK('company-123', 'vault:v1:encrypted-dek');

      expect(result.toString()).toBe('decrypted-dek');
      expect(mockVault.transitDecrypt).toHaveBeenCalledWith('vault:v1:encrypted-dek');
    });
  });

  describe('destroyCompanyKey', () => {
    it('should delete the transit key', async () => {
      await hierarchy.destroyCompanyKey('company-123');

      const expectedKeyName = companyKeyName('company-123');
      expect(mockVault.deleteTransitKey).toHaveBeenCalledWith(expectedKeyName);
    });
  });
});

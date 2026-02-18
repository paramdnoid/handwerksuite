import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VaultClient } from './vault-client';

describe('VaultClient', () => {
  let client: VaultClient;
  const mockFetch = vi.fn();

  beforeEach(() => {
    mockFetch.mockClear();
    vi.stubGlobal('fetch', mockFetch);
    client = new VaultClient({
      address: 'http://localhost:8200',
      token: 'test-token',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('constructor', () => {
    it('should strip trailing slash from address', () => {
      const clientWithSlash = new VaultClient({
        address: 'http://localhost:8200/',
        token: 'test-token',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: vi.fn(),
        text: vi.fn(),
      });

      clientWithSlash.createTransitKey('test', {
        type: 'aes256-gcm96',
        exportable: false,
        allowPlaintextBackup: false,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8200/v1/transit/keys/test',
        expect.any(Object),
      );
    });

    it('should use custom transit mount path', () => {
      const customClient = new VaultClient({
        address: 'http://localhost:8200',
        token: 'test-token',
        transitMountPath: 'custom-transit',
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: vi.fn(),
        text: vi.fn(),
      });

      customClient.createTransitKey('test', {
        type: 'aes256-gcm96',
        exportable: false,
        allowPlaintextBackup: false,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8200/v1/custom-transit/keys/test',
        expect.any(Object),
      );
    });
  });

  describe('createTransitKey', () => {
    it('should send POST with correct parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: vi.fn(),
        text: vi.fn(),
      });

      await client.createTransitKey('my-key', {
        type: 'aes256-gcm96',
        exportable: false,
        allowPlaintextBackup: false,
        autoRotatePeriod: '90d',
      });

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8200/v1/transit/keys/my-key', {
        method: 'POST',
        headers: {
          'X-Vault-Token': 'test-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'aes256-gcm96',
          exportable: false,
          allow_plaintext_backup: false,
          auto_rotate_period: '90d',
        }),
      });
    });
  });

  describe('transitEncrypt', () => {
    it('should encrypt data and return ciphertext with version', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          data: {
            ciphertext: 'vault:v1:encrypted-data',
            key_version: 1,
          },
        }),
        text: vi.fn(),
      });

      const result = await client.transitEncrypt('my-key', Buffer.from('plaintext'));

      expect(result.ciphertext).toBe('vault:v1:encrypted-data');
      expect(result.keyVersion).toBe(1);
    });

    it('should send base64-encoded plaintext', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          data: { ciphertext: 'vault:v1:test', key_version: 1 },
        }),
        text: vi.fn(),
      });

      const plaintext = Buffer.from('hello');
      await client.transitEncrypt('key', plaintext);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.plaintext).toBe(plaintext.toString('base64'));
    });
  });

  describe('transitDecrypt', () => {
    it('should decrypt ciphertext and return plaintext buffer', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          data: { plaintext: Buffer.from('decrypted').toString('base64') },
        }),
        text: vi.fn(),
      });

      const result = await client.transitDecrypt('vault:v1:encrypted-data');
      expect(result.toString()).toBe('decrypted');
    });
  });

  describe('deleteTransitKey', () => {
    it('should first enable deletion then delete', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, status: 204, json: vi.fn(), text: vi.fn() })
        .mockResolvedValueOnce({ ok: true, status: 204, json: vi.fn(), text: vi.fn() });

      await client.deleteTransitKey('old-key');

      expect(mockFetch).toHaveBeenCalledTimes(2);

      // First call: enable deletion
      expect(mockFetch.mock.calls[0][0]).toBe(
        'http://localhost:8200/v1/transit/keys/old-key/config',
      );
      const firstBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(firstBody.deletion_allowed).toBe(true);

      // Second call: delete key
      expect(mockFetch.mock.calls[1][0]).toBe('http://localhost:8200/v1/transit/keys/old-key');
      expect(mockFetch.mock.calls[1][1].method).toBe('DELETE');
    });
  });

  describe('error handling', () => {
    it('should throw on non-OK response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        text: vi.fn().mockResolvedValue('permission denied'),
      });

      await expect(
        client.createTransitKey('key', {
          type: 'aes256-gcm96',
          exportable: false,
          allowPlaintextBackup: false,
        }),
      ).rejects.toThrow('Vault request failed: 403 Forbidden');
    });
  });
});

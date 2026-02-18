import { describe, it, expect } from 'vitest';
import { buildAAD, verifyAAD, companyKeyName } from './aad';

describe('buildAAD', () => {
  it('should create a canonical AAD buffer', () => {
    const aad = buildAAD('company-123', 'record-456', 'email');
    const expected = 'v1:company-123:record-456:email';
    expect(aad.toString('utf-8')).toBe(expected);
  });

  it('should produce different AADs for different contexts', () => {
    const aad1 = buildAAD('company-1', 'record-1', 'email');
    const aad2 = buildAAD('company-2', 'record-1', 'email');
    expect(aad1.equals(aad2)).toBe(false);
  });

  it('should produce different AADs for different fields', () => {
    const aad1 = buildAAD('company-1', 'record-1', 'email');
    const aad2 = buildAAD('company-1', 'record-1', 'phone');
    expect(aad1.equals(aad2)).toBe(false);
  });

  it('should produce different AADs for different records', () => {
    const aad1 = buildAAD('company-1', 'record-1', 'email');
    const aad2 = buildAAD('company-1', 'record-2', 'email');
    expect(aad1.equals(aad2)).toBe(false);
  });

  it('should handle special characters in inputs', () => {
    const aad = buildAAD('comp-äöü', 'rec/special', 'field.name');
    expect(aad.toString('utf-8')).toBe('v1:comp-äöü:rec/special:field.name');
  });

  it('should handle empty strings', () => {
    const aad = buildAAD('', '', '');
    expect(aad.toString('utf-8')).toBe('v1:::');
  });
});

describe('verifyAAD', () => {
  it('should return true for matching AAD', () => {
    const aad = buildAAD('company-123', 'record-456', 'email');
    expect(verifyAAD(aad, 'company-123', 'record-456', 'email')).toBe(true);
  });

  it('should return false for mismatched company', () => {
    const aad = buildAAD('company-123', 'record-456', 'email');
    expect(verifyAAD(aad, 'company-999', 'record-456', 'email')).toBe(false);
  });

  it('should return false for mismatched record', () => {
    const aad = buildAAD('company-123', 'record-456', 'email');
    expect(verifyAAD(aad, 'company-123', 'record-999', 'email')).toBe(false);
  });

  it('should return false for mismatched field', () => {
    const aad = buildAAD('company-123', 'record-456', 'email');
    expect(verifyAAD(aad, 'company-123', 'record-456', 'phone')).toBe(false);
  });

  it('should return false for different length buffers', () => {
    const aad = Buffer.from('short');
    expect(verifyAAD(aad, 'company-123', 'record-456', 'email')).toBe(false);
  });

  it('should return false for tampered AAD', () => {
    const aad = buildAAD('company-123', 'record-456', 'email');
    aad[0] = aad[0]! ^ 0xff; // flip bits
    expect(verifyAAD(aad, 'company-123', 'record-456', 'email')).toBe(false);
  });
});

describe('companyKeyName', () => {
  it('should generate a deterministic key name', () => {
    const name1 = companyKeyName('company-123');
    const name2 = companyKeyName('company-123');
    expect(name1).toBe(name2);
  });

  it('should generate different names for different companies', () => {
    const name1 = companyKeyName('company-1');
    const name2 = companyKeyName('company-2');
    expect(name1).not.toBe(name2);
  });

  it('should follow the expected format', () => {
    const name = companyKeyName('company-123');
    expect(name).toMatch(/^company-[a-f0-9]{12}-kek$/);
  });

  it('should use first 12 characters of SHA256 hash', () => {
    const name = companyKeyName('test-company');
    const parts = name.split('-');
    expect(parts[0]).toBe('company');
    expect(parts[1]).toHaveLength(12);
    expect(parts[2]).toBe('kek');
  });
});

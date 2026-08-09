import { describe, it, expect } from 'vitest';
import { formatBytes, formatCurrency, formatDate } from '../../app/utils/format';

describe('formatBytes utility', () => {
  it('handles null, undefined and 0', () => {
    expect(formatBytes(null)).toBe('0 B');
    expect(formatBytes(undefined)).toBe('0 B');
    expect(formatBytes(0)).toBe('0 B');
  });

  it('handles unlimited (-1)', () => {
    expect(formatBytes(-1)).toBe('Unlimited');
  });

  it('formats bytes, kilobytes, megabytes, and gigabytes correctly', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(5368709120)).toBe('5 GB');
  });
});

describe('formatCurrency utility', () => {
  it('formats THB correctly', () => {
    expect(formatCurrency(190, 'th')).toContain('190');
    expect(formatCurrency(190, 'en')).toContain('190');
  });
});

describe('formatDate utility', () => {
  it('handles invalid dates gracefully', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('invalid-date')).toBe('');
  });

  it('formats valid dates correctly', () => {
    const d = new Date('2026-08-08T00:00:00Z');
    expect(formatDate(d, 'en')).toContain('2026');
  });
});

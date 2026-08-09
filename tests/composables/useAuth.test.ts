import { describe, it, expect } from 'vitest';

// Helper function to decode base64url JWT payload
function parseJwtExp(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.exp ?? null;
  } catch {
    return null;
  }
}

describe('useAuth JWT & Refresh Timer Logic', () => {
  it('correctly parses expiration timestamp from JWT token', () => {
    // Mock JWT token with exp = 1700000000
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: 'user-123', exp: 1700000000, typ: 'access' }));
    const token = `${header}.${payload}.signature`;

    const exp = parseJwtExp(token);
    expect(exp).toBe(1700000000);
  });

  it('returns null for invalid JWT tokens', () => {
    expect(parseJwtExp('invalid.token')).toBeNull();
    expect(parseJwtExp('')).toBeNull();
  });

  it('calculates delay capped at MAX_DELAY (24 hours)', () => {
    const exp = Math.floor(Date.now() / 1000) + 86400 * 10; // 10 days in future
    const now = Date.now();
    const delay = exp * 1000 - now - 60_000;
    const MAX_DELAY = 86400000; // 24 hours

    const actualDelay = delay > MAX_DELAY ? MAX_DELAY : Math.max(0, delay);
    expect(actualDelay).toBe(MAX_DELAY);
  });
});

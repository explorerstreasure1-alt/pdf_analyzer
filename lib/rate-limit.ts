/**
 * Simple in-memory rate limiter for API routes
 * Note: For production with multiple instances, use Redis or similar
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(identifier);

    // Clean up expired entries
    if (entry && now > entry.resetTime) {
      rateLimitMap.delete(identifier);
    }

    const currentEntry = rateLimitMap.get(identifier) || {
      count: 0,
      resetTime: now + this.config.windowMs,
    };

    if (currentEntry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: currentEntry.resetTime,
      };
    }

    currentEntry.count++;
    rateLimitMap.set(identifier, currentEntry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - currentEntry.count,
      resetTime: currentEntry.resetTime,
    };
  }

  // Clean up old entries periodically to prevent memory leaks
  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => RateLimiter.cleanup(), 5 * 60 * 1000);
}

// Export a default rate limiter instance
export const defaultRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 requests per 15 minutes per IP
});

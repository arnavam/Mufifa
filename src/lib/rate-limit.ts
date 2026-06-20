export class RateLimit {
  private cache: Map<string, { count: number; expiresAt: number }>

  constructor() {
    this.cache = new Map()
  }

  /**
   * Check if a request should be rate limited.
   * @param key Identifier for the user/IP.
   * @param limit Maximum number of requests allowed in the window.
   * @param windowMs Window duration in milliseconds.
   * @returns An object with `success` true if allowed, false if limited.
   */
  public check(key: string, limit: number, windowMs: number): { success: boolean; remaining: number } {
    const now = Date.now()
    const record = this.cache.get(key)

    if (!record || record.expiresAt < now) {
      // First request or window expired
      this.cache.set(key, { count: 1, expiresAt: now + windowMs })
      
      // Cleanup expired entries periodically
      if (Math.random() < 0.1) this.cleanup(now)
      
      return { success: true, remaining: limit - 1 }
    }

    if (record.count >= limit) {
      return { success: false, remaining: 0 }
    }

    record.count += 1
    return { success: true, remaining: limit - record.count }
  }

  private cleanup(now: number) {
    for (const [k, v] of this.cache.entries()) {
      if (v.expiresAt < now) {
        this.cache.delete(k)
      }
    }
  }
}

// Global instance for server-side rate limiting
export const globalRateLimiter = new RateLimit()

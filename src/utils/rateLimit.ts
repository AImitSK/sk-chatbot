import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

export interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

export default function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: async (response: NextResponse, limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;

      const currentUsage = tokenCount[0];
      response.headers.set('X-RateLimit-Limit', limit.toString());
      response.headers.set('X-RateLimit-Remaining', Math.max(0, limit - currentUsage).toString());

      if (currentUsage > limit) {
        throw new Error('Rate limit exceeded');
      }
    },
  };
}

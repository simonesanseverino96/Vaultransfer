import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Upload: max 10 upload ogni 10 minuti per IP
export const uploadRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 m'),
  analytics: true,
  prefix: 'vt:upload',
})

// API v1: max 100 richieste ogni 10 minuti per API key
export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '10 m'),
  analytics: true,
  prefix: 'vt:api',
})

// Login: max 5 tentativi ogni 15 minuti per IP
export const loginRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: 'vt:login',
})
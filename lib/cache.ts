import { kv } from "@vercel/kv"

const CACHE_TTL = 60 * 60 * 24 // 24 hours in seconds

// Check if KV is configured
export const isKVConfigured = () => {
  return !!process.env.KV_URL || !!process.env.KV_REST_API_URL || !!process.env.KV_REST_API_TOKEN
}

export async function getCachedAvatar(key: string): Promise<Buffer | null> {
  // Skip if KV is not configured
  if (!isKVConfigured()) {
    return null
  }

  try {
    const cachedData = await kv.get<string>(key)

    if (cachedData) {
      // Convert base64 string back to Buffer
      return Buffer.from(cachedData, "base64")
    }

    return null
  } catch (error) {
    console.error("Cache get error:", error)
    return null
  }
}

export async function cacheAvatar(key: string, data: Buffer): Promise<void> {
  // Skip if KV is not configured
  if (!isKVConfigured()) {
    return
  }

  try {
    // Convert Buffer to base64 string for storage
    const base64Data = data.toString("base64")
    await kv.set(key, base64Data, { ex: CACHE_TTL })
  } catch (error) {
    console.error("Cache set error:", error)
  }
}

export function generateCacheKey(hash: string, size: string, defaultImage: string, rating: string): string {
  return `gravatar:${hash}:${size}:${defaultImage}:${rating}`
}

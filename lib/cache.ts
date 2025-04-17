import { kv } from "@vercel/kv"

const CACHE_TTL = 60 * 60 * 24 // 24小时（秒）

// 检查KV是否配置
export const isKVConfigured = () => {
  return !!process.env.KV_URL || !!process.env.KV_REST_API_URL || !!process.env.KV_REST_API_TOKEN
}

export async function getCachedAvatar(key: string): Promise<Buffer | null> {
  // 如果KV未配置则跳过
  if (!isKVConfigured()) {
    return null
  }

  try {
    const cachedData = await kv.get<string>(key)

    if (cachedData) {
      // 将base64字符串转回Buffer
      return Buffer.from(cachedData, "base64")
    }

    return null
  } catch (error) {
    console.error("Cache get error:", error)
    return null
  }
}

export async function cacheAvatar(key: string, data: Buffer): Promise<void> {
  // 如果KV未配置则跳过
  if (!isKVConfigured()) {
    return
  }

  try {
    // 将Buffer转换为base64字符串存储
    const base64Data = data.toString("base64")
    await kv.set(key, base64Data, { ex: CACHE_TTL })
  } catch (error) {
    console.error("Cache set error:", error)
  }
}

export function generateCacheKey(hash: string, size: string, defaultImage: string, rating: string): string {
  return `gravatar:${hash}:${size}:${defaultImage}:${rating}`
}

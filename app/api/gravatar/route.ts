import { type NextRequest, NextResponse } from "next/server"
import { cacheAvatar, getCachedAvatar, generateCacheKey } from "@/lib/cache"

export const runtime = "nodejs"

/**
 * Gravatar头像代理
 *
 * 参数:
 * - hash: 电子邮件地址的MD5哈希
 * - s: 头像大小（默认：80）
 * - d: 当电子邮件哈希不存在时使用的默认图像（默认：mp）
 * - r: 头像评级（默认：g）
 *
 * 示例: /api/gravatar?hash=00000000000000000000000000000000&s=80&d=mp&r=g
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // 从请求中获取参数
  const hash = searchParams.get("hash")
  const size = searchParams.get("s") || "80"
  const defaultImage = searchParams.get("d") || "mp"
  const rating = searchParams.get("r") || "g"

  // 验证hash参数
  if (!hash) {
    return new NextResponse("Missing hash parameter", { status: 400 })
  }

  try {
    // 生成缓存键
    const cacheKey = generateCacheKey(hash, size, defaultImage, rating)

    // 尝试从缓存获取
    const cachedAvatar = await getCachedAvatar(cacheKey)
    let imageData: ArrayBuffer
    let contentType: string
    let cacheHit = false

    if (cachedAvatar) {
      // 使用缓存的头像
      imageData = cachedAvatar
      contentType = "image/jpeg" // 默认，可以通过在缓存中存储内容类型来改进
      cacheHit = true
    } else {
      // 构造Gravatar URL
      const gravatarUrl = `https://secure.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}&r=${rating}`

      // 从Gravatar获取头像
      const response = await fetch(gravatarUrl)

      if (!response.ok) {
        return new NextResponse("Failed to fetch avatar", { status: response.status })
      }

      // 获取图像数据和内容类型
      imageData = await response.arrayBuffer()
      contentType = response.headers.get("content-type") || "image/jpeg"

      // 缓存头像
      await cacheAvatar(cacheKey, Buffer.from(imageData))
    }

    // 返回带有适当头信息的图像
    return new NextResponse(imageData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "X-Cache": cacheHit ? "HIT" : "MISS",
      },
    })
  } catch (error) {
    console.error("Error fetching Gravatar:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

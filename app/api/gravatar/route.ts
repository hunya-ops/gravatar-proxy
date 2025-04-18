import { type NextRequest, NextResponse } from "next/server"
import { cacheAvatar, getCachedAvatar, generateCacheKey } from "@/lib/cache"

export const runtime = "nodejs"

/**
 * Gravatar avatar proxy
 *
 * Parameters:
 * - hash: MD5 hash of email address
 * - s: Avatar size (default: 80)
 * - d: Default image when email hash doesn't exist (default: mp)
 * - r: Avatar rating (default: g)
 *
 * Example: /api/gravatar?hash=00000000000000000000000000000000&s=80&d=mp&r=g
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Get parameters from request
  const hash = searchParams.get("hash")
  const size = searchParams.get("s") || "80"
  const defaultImage = searchParams.get("d") || "mp"
  const rating = searchParams.get("r") || "g"

  // Validate hash parameter
  if (!hash) {
    return new NextResponse("Missing hash parameter", { status: 400 })
  }

  try {
    // Generate cache key
    const cacheKey = generateCacheKey(hash, size, defaultImage, rating)

    // Try to get from cache
    const cachedAvatar = await getCachedAvatar(cacheKey)
    let imageData: ArrayBuffer
    let contentType: string
    let cacheHit = false

    if (cachedAvatar) {
      // Use cached avatar
      imageData = cachedAvatar
      contentType = "image/jpeg" // Default, could be improved by storing content type in cache
      cacheHit = true
    } else {
      // Construct Gravatar URL
      const gravatarUrl = `https://secure.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}&r=${rating}`

      // Fetch avatar from Gravatar
      const response = await fetch(gravatarUrl)

      if (!response.ok) {
        return new NextResponse("Failed to fetch avatar", { status: response.status })
      }

      // Get image data and content type
      imageData = await response.arrayBuffer()
      contentType = response.headers.get("content-type") || "image/jpeg"

      // Cache avatar
      await cacheAvatar(cacheKey, Buffer.from(imageData))
    }

    // Return image with appropriate headers
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

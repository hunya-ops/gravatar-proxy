import { NextResponse } from "next/server"
import { isKVConfigured } from "@/lib/cache"
import { kv } from "@vercel/kv"

export async function GET() {
  // 检查KV是否配置
  if (!isKVConfigured()) {
    return NextResponse.json({
      connected: false,
      message: "KV存储未配置。请在Vercel控制台中添加KV集成。",
    })
  }

  try {
    // 尝试进行简单的KV操作以验证连接
    const testKey = "test:connection"
    await kv.set(testKey, "ok", { ex: 10 }) // 10秒过期
    const result = await kv.get(testKey)

    if (result === "ok") {
      return NextResponse.json({ connected: true })
    } else {
      return NextResponse.json({
        connected: false,
        message: "KV存储连接测试失败。",
      })
    }
  } catch (error) {
    console.error("KV connection test error:", error)
    return NextResponse.json({
      connected: false,
      message: "KV存储连接测试出错。",
    })
  }
}

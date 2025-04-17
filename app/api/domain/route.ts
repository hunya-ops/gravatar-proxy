import { NextResponse } from "next/server"

export async function GET() {
  const domain = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || "your-domain.com"

  // Format the domain properly (add https:// if needed)
  const formattedDomain = domain.includes("://") ? domain : `https://${domain}`

  return NextResponse.json({
    domain: formattedDomain,
    raw: {
      NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
      VERCEL_URL: process.env.VERCEL_URL,
    },
  })
}

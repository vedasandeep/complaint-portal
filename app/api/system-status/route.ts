import { NextResponse } from "next/server"
import { isSystemInitialized } from "@/lib/data-store"

export async function GET() {
  try {
    const initialized = isSystemInitialized()

    return NextResponse.json({
      initialized,
      message: initialized ? "System is initialized" : "System needs setup",
    })
  } catch (error) {
    return NextResponse.json(
      {
        initialized: false,
        error: "Failed to check system status",
      },
      { status: 500 },
    )
  }
}

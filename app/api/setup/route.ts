import { NextResponse } from "next/server"
import { resetData } from "@/lib/data-store"

export async function POST() {
  try {
    resetData()
    return NextResponse.json({
      message: "Sample data created successfully!",
      accounts: [
        { email: "admin@example.com", password: "admin123", role: "admin" },
        { email: "john@example.com", password: "user123", role: "user" },
      ],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create sample data" }, { status: 500 })
  }
}

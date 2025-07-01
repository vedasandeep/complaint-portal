import { type NextRequest, NextResponse } from "next/server"
import { addGrievance, getGrievancesByUserId, type Grievance } from "@/lib/data-store"

export async function POST(request: NextRequest) {
  try {
    const { title, description, department, userId } = await request.json()

    const newGrievance: Grievance = {
      id: Date.now().toString(),
      title,
      description,
      department,
      status: "Pending",
      submittedAt: new Date().toISOString(),
      userId,
    }

    addGrievance(newGrievance)

    return NextResponse.json({
      message: "Grievance submitted successfully",
      grievance: newGrievance,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit grievance" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const userGrievances = getGrievancesByUserId(userId)

    return NextResponse.json({
      grievances: userGrievances,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch grievances" }, { status: 500 })
  }
}

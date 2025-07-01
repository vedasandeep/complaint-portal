import { type NextRequest, NextResponse } from "next/server"
import { updateGrievance } from "@/lib/data-store"

export async function POST(request: NextRequest) {
  try {
    const { grievanceId, response, status } = await request.json()

    // Update the grievance
    const updatedGrievance = updateGrievance(grievanceId, {
      status,
      adminResponse: response,
      respondedAt: new Date().toISOString(),
    })

    if (!updatedGrievance) {
      return NextResponse.json({ error: "Grievance not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Response submitted successfully",
      grievance: updatedGrievance,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit response" }, { status: 500 })
  }
}

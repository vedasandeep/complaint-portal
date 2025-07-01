import { NextResponse } from "next/server"
import { getAllGrievances, findUserById } from "@/lib/data-store"

export async function GET() {
  try {
    // Get all grievances with user information
    const allGrievances = getAllGrievances()

    const grievancesWithUserInfo = allGrievances.map((grievance) => {
      const user = findUserById(grievance.userId)
      return {
        ...grievance,
        userName: user?.name || "Unknown User",
        userEmail: user?.email || "Unknown Email",
      }
    })

    // Sort by submission date (newest first)
    grievancesWithUserInfo.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

    return NextResponse.json({
      grievances: grievancesWithUserInfo,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch grievances" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { addUser, findUserByEmail, type User } from "@/lib/data-store"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role = "user" } = await request.json()

    // Check if user already exists
    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, this should be hashed
      role: role as "user" | "admin",
    }

    addUser(newUser)

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      message: "User registered successfully",
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

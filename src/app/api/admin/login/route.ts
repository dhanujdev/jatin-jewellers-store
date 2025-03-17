import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Replace with your actual admin credentials check
    const isValidCredentials = 
      username === process.env.ADMIN_USERNAME && 
      password === process.env.ADMIN_PASSWORD

    if (!isValidCredentials) {
      return new NextResponse("Invalid credentials", { status: 401 })
    }

    // Set the session token in cookies
    cookies().set("session_token", process.env.ADMIN_SESSION_TOKEN!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // Expire in 24 hours
      maxAge: 60 * 60 * 24,
    })

    return new NextResponse("Login successful", { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Login failed",
      { status: 500 }
    )
  }
} 
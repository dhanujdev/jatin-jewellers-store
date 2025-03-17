import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const token = formData.get("token")
    const validToken = process.env.ADMIN_TOKEN

    if (token === validToken) {
      // Set the admin token cookie
      const cookieStore = cookies()
      cookieStore.set("admin_token", token as string, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })

      return NextResponse.redirect(new URL("/admin", request.url), {
        status: 303
      })
    }

    // Redirect back to login with error
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("error", "Invalid token")
    return NextResponse.redirect(loginUrl, {
      status: 303
    })
  } catch (error) {
    console.error("Login error:", error)
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("error", "Server error")
    return NextResponse.redirect(loginUrl, {
      status: 303
    })
  }
} 
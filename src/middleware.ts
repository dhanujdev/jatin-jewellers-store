import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Normalize the pathname by removing trailing slash
  const pathname = request.nextUrl.pathname.replace(/\/$/, '')
  console.log("DEBUG: Current path (normalized):", pathname)

  // Define admin routes that require protection
  const protectedRoutes = [
    "/admin",
    "/admin/products",
    "/admin/categories",
    "/admin/media",
    "/admin/pages",
    "/admin/analytics",
    "/admin/users",
    "/admin/settings"
  ]
  
  // Always allow access to login page
  if (pathname === "/admin/login") {
    // If user is already logged in, redirect to dashboard
    const token = request.cookies.get("admin-token")
    if (token?.value === "jatinjewellersadmin") {
      console.log("DEBUG: User already logged in, redirecting to dashboard")
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    console.log("DEBUG: Login page accessed")
    return NextResponse.next()
  }

  // Check if current path is a protected route
  if (protectedRoutes.includes(pathname)) {
    // Check for admin token cookie
    const token = request.cookies.get("admin-token")
    console.log("DEBUG: Checking admin token:", token?.value)

    if (!token || token.value !== "jatinjewellersadmin") {
      console.log("DEBUG: No valid token, redirecting to login")
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }

    console.log("DEBUG: Valid token found, proceeding")
    return NextResponse.next()
  }

  // For any other paths, proceed normally
  console.log("DEBUG: Non-protected route, proceeding")
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin",
    "/admin/",
    "/admin/login",
    "/admin/login/",
    "/admin/products",
    "/admin/products/",
    "/admin/categories",
    "/admin/categories/",
    "/admin/media",
    "/admin/media/",
    "/admin/pages",
    "/admin/pages/",
    "/admin/analytics",
    "/admin/analytics/",
    "/admin/users",
    "/admin/users/",
    "/admin/settings",
    "/admin/settings/"
  ]
} 
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"

export async function checkAdminAuth(cookieStore: ReadonlyRequestCookies): Promise<boolean> {
  try {
    // Get the admin token from cookies
    const adminToken = await Promise.resolve(cookieStore.get("admin-token"))

    if (!adminToken) {
      return false
    }

    // Verify the admin token
    const isValid = adminToken.value === "jatinjewellersadmin"
    return isValid
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
} 
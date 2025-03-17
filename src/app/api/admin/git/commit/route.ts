import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { exec } from "child_process"
import { promisify } from "util"
import { checkAdminAuth } from "../../../../../lib/auth"

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const isAdmin = await checkAdminAuth(cookieStore)
    
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { files, message, branch } = body

    if (!Array.isArray(files) || !message || !branch) {
      return new NextResponse("Invalid request body", { status: 400 })
    }

    try {
      // Try to check out the branch
      await execAsync(`git checkout ${branch}`)
    } catch (error) {
      // If branch doesn't exist, create it from current branch
      await execAsync(`git checkout -b ${branch}`)
    }

    // Add the specified files
    for (const file of files) {
      await execAsync(`git add "${file}"`)
    }

    // Commit the changes
    await execAsync(`git commit -m "${message}"`)

    // Push the changes, creating the remote branch if needed
    await execAsync(`git push --set-upstream origin ${branch}`)

    return new NextResponse("Changes committed successfully", { status: 200 })
  } catch (error) {
    console.error("Git commit error:", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Failed to commit changes",
      { status: 500 }
    )
  }
} 
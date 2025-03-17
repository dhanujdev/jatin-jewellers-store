import { EditProductClient } from "./edit-product-client"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { readFile } from "fs/promises"
import path from "path"

interface Props {
  params: Promise<{
    category: string
    id: string
  }>
}

export default async function EditProductPage({ params }: Props) {
  // Check admin authentication
  const cookieStore = await cookies()
  const token = cookieStore.get("admin-token")?.value

  if (!token || token !== "jatinjewellersadmin") {
    redirect("/admin/login")
  }

  try {
    // Ensure params are available
    const { category, id } = await params
    
    // Load from individual product file
    const productPath = path.join(process.cwd(), 'public', 'products', category, id, 'data.json')
    const data = await readFile(productPath, 'utf-8')
    const product = JSON.parse(data)

    return <EditProductClient product={product} />
  } catch (error) {
    console.error('Failed to load product:', error)
    redirect("/admin/products")
  }
} 
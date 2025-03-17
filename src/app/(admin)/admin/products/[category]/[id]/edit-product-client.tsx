"use client"

import { EditForm } from "./edit-form"
import Link from "next/link"
import { Product } from "@/types/product"

interface EditProductClientProps {
  product: Product
}

export function EditProductClient({ product }: EditProductClientProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
          Admin
        </Link>
        <span className="text-sm text-muted-foreground">/</span>
        <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-foreground">
          Products
        </Link>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm">Edit Product</span>
      </div>
      <h1 className="text-2xl font-bold mb-8">Edit Product</h1>
      <EditForm product={product} />
    </div>
  )
} 
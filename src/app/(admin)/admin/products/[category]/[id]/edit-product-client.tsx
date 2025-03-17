"use client"

import { EditForm } from "./edit-form"
import Link from "next/link"
import { Product } from "@/types/product"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface EditProductClientProps {
  product: Product
}

export function EditProductClient({ product }: EditProductClientProps) {
  const [isImageOpen, setIsImageOpen] = useState(false)
  const imagePath = `/products/${product.category}/${product.id}/image.jpg`

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
      <h1 className="text-2xl font-bold mb-8">Edit Product: {product.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Image */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
              <DialogTrigger asChild>
                <div className="relative aspect-square w-full overflow-hidden rounded-lg mb-4 cursor-pointer transition-transform hover:scale-[1.02]">
                  <Image
                    src={imagePath}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-[90vw] max-h-[90vh]">
                <DialogTitle asChild>
                  <VisuallyHidden>
                    {product.title} - Full Size Image
                  </VisuallyHidden>
                </DialogTitle>
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={imagePath}
                    alt={product.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </DialogContent>
            </Dialog>
            <h2 className="text-lg font-semibold">{product.title}</h2>
            <p className="text-sm text-muted-foreground capitalize">Category: {product.category}</p>
            <p className="text-sm text-muted-foreground">ID: {product.id}</p>
          </Card>
        </div>
        
        {/* Edit Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <EditForm product={product} />
          </Card>
        </div>
      </div>
    </div>
  )
} 
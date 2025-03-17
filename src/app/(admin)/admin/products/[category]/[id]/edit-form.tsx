"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: string
  title: string
  category: string
  original_type: string
  materials: string[]
  features: string
  colors: string[]
  occasions: string[]
  description: string
  tags: string[]
  original_id: string
  collection: string
}

interface EditFormProps {
  product: Product
}

export function EditForm({ product }: EditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: product.title,
    category: product.category,
    original_type: product.original_type,
    materials: product.materials.join('\n'),
    features: product.features,
    colors: product.colors.join('\n'),
    occasions: product.occasions.join('\n'),
    description: product.description,
    tags: product.tags.join(', '),
    original_id: product.original_id,
    collection: product.collection,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert string fields back to arrays
      const processedData = {
        ...formData,
        id: product.id, // Keep the original ID
        materials: formData.materials.split('\n').map((item: string) => item.trim()).filter(Boolean),
        colors: formData.colors.split('\n').map((item: string) => item.trim()).filter(Boolean),
        occasions: formData.occasions.split('\n').map((item: string) => item.trim()).filter(Boolean),
        tags: formData.tags.split(',').map((item: string) => item.trim()).filter(Boolean),
      }

      // First, save to the API
      const response = await fetch(`/api/admin/products/${product.category}/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update product")
      }

      // Then, commit the changes to the feature branch
      const commitResponse = await fetch('/api/admin/git/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: [`public/products/${product.category}/${product.id}/data.json`],
          message: `Update product: ${product.title} (${product.id})`,
          branch: 'feature/product-updates'
        }),
      })

      if (!commitResponse.ok) {
        throw new Error("Failed to commit changes")
      }

      toast({
        title: "Success",
        description: "Product updated and changes committed successfully",
      })

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, category: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="original_type" className="text-sm font-medium">
          Original Type
        </label>
        <Input
          id="original_type"
          value={formData.original_type}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, original_type: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="materials" className="text-sm font-medium">
          Materials (one per line)
        </label>
        <Textarea
          id="materials"
          value={formData.materials}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, materials: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="features" className="text-sm font-medium">
          Features
        </label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, features: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="colors" className="text-sm font-medium">
          Colors (one per line)
        </label>
        <Textarea
          id="colors"
          value={formData.colors}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, colors: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="occasions" className="text-sm font-medium">
          Occasions (one per line)
        </label>
        <Textarea
          id="occasions"
          value={formData.occasions}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, occasions: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium">
          Tags (comma-separated)
        </label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tags: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="original_id" className="text-sm font-medium">
          Original ID
        </label>
        <Input
          id="original_id"
          value={formData.original_id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, original_id: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="collection" className="text-sm font-medium">
          Collection
        </label>
        <Input
          id="collection"
          value={formData.collection}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, collection: e.target.value })}
          required
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  )
} 
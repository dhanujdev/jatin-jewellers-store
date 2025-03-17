import { AdminService } from "@/lib/services/admin-service"
import { Category } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CategoryCard } from "./category-card"

async function getCategories(): Promise<Category[]> {
  const adminService = AdminService.getInstance()
  return adminService.getCategories()
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
} 
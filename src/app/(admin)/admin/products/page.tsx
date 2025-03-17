import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products - Admin Dashboard",
  description: "Manage your products",
}

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product listings here.
          </p>
        </div>
      </div>
      <div className="rounded-lg border">
        {/* Product table will go here */}
        <div className="p-4">Coming soon...</div>
      </div>
    </div>
  )
} 
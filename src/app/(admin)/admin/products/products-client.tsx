"use client"

import { useEffect, useState } from "react"
import { Product } from "@/types/product"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function ProductsClient() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      // Clear cache by adding a timestamp to the URL
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/admin/products?t=${timestamp}`)
      if (!response.ok) {
        throw new Error('Failed to refresh products')
      }
      const data = await response.json()
      setProducts(data)
      toast({
        title: "Success",
        description: "Products refreshed successfully",
      })
    } catch (error) {
      console.error('Error refreshing products:', error)
      toast({
        title: "Error",
        description: "Failed to refresh products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
          Admin
        </Link>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm">Products</span>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your product listings here.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              disabled={refreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Link href="/admin/products/new">
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
        <div className="rounded-lg border">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <DataTable columns={columns} data={products} />
          )}
        </div>
      </div>
    </div>
  )
} 
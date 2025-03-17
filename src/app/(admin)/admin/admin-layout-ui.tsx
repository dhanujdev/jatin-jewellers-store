"use client"

import { Inter } from "next/font/google"
import Link from "next/link"
import { Boxes, Package, Tag } from "lucide-react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ["latin"] })

interface AdminLayoutUIProps {
  children: React.ReactNode
}

export default function AdminLayoutUI({ children }: AdminLayoutUIProps) {
  const pathname = usePathname()
  const isProductsPage = pathname === "/admin/products"

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden border-r bg-gray-100/40 lg:block lg:w-60">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/admin" className="flex items-center space-x-2">
                <Boxes className="h-6 w-6" />
                <span className="font-bold">Admin Dashboard</span>
              </Link>
            </div>
            <nav className="flex-1 space-y-1 p-2">
              <Link href="/admin/products">
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start",
                    isProductsPage && "bg-gray-200"
                  )}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full justify-start opacity-50 cursor-not-allowed"
                disabled
              >
                <Tag className="mr-2 h-4 w-4" />
                Categories (Coming Soon)
              </Button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="h-full p-8">{children}</div>
        </div>
      </div>
    </div>
  )
} 
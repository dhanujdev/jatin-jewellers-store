"use client"

import { Inter } from "next/font/google"
import Link from "next/link"
import { 
  Boxes, 
  Package, 
  FolderTree, 
  Settings, 
  Users, 
  ImagePlus,
  FileText,
  BarChart
} from "lucide-react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ["latin"] })

interface AdminLayoutUIProps {
  children: React.ReactNode
}

export default function AdminLayoutUI({ children }: AdminLayoutUIProps) {
  const pathname = usePathname()

  // Define admin features with their routes and status
  const adminFeatures = [
    {
      title: "Dashboard",
      icon: Boxes,
      href: "/admin",
      status: "active"
    },
    {
      title: "Manage Categories",
      icon: FolderTree,
      href: "/admin/categories",
      status: "active"
    },
    {
      title: "Manage Products",
      icon: Package,
      href: "/admin/products",
      status: "active"
    },
    {
      title: "Media Library",
      icon: ImagePlus,
      href: "/admin/media",
      status: "coming-soon"
    },
    {
      title: "Content Pages",
      icon: FileText,
      href: "/admin/pages",
      status: "coming-soon"
    },
    {
      title: "Analytics",
      icon: BarChart,
      href: "/admin/analytics",
      status: "coming-soon"
    },
    {
      title: "User Management",
      icon: Users,
      href: "/admin/users",
      status: "coming-soon"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
      status: "coming-soon"
    }
  ]

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
              {adminFeatures.map((feature) => (
                feature.status === "active" ? (
                  <Link key={feature.href} href={feature.href}>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-start",
                        pathname === feature.href && "bg-gray-200"
                      )}
                    >
                      <feature.icon className="mr-2 h-4 w-4" />
                      {feature.title}
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    key={feature.href}
                    variant="ghost" 
                    className="w-full justify-start opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <feature.icon className="mr-2 h-4 w-4" />
                    {feature.title} (Coming Soon)
                  </Button>
                )
              ))}
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
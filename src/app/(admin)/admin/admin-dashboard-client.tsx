"use client"

import { Card } from "@/components/ui/card"
import { 
  LayoutDashboard, 
  FolderTree, 
  Package, 
  Settings, 
  Users, 
  ImagePlus,
  FileText,
  BarChart
} from "lucide-react"
import Link from "next/link"

// Define admin features
const adminFeatures = [
  {
    title: "Manage Categories",
    description: "Define and organize product categories and subcategories",
    icon: FolderTree,
    href: "/admin/categories",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    status: "active"
  },
  {
    title: "Manage Products",
    description: "Add, edit, and organize product listings",
    icon: Package,
    href: "/admin/products",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    status: "active"
  },
  {
    title: "Media Library",
    description: "Upload and manage product images and media",
    icon: ImagePlus,
    href: "/admin/media",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    status: "coming-soon"
  },
  {
    title: "Content Pages",
    description: "Manage about, contact, and other content pages",
    icon: FileText,
    href: "/admin/pages",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    status: "coming-soon"
  },
  {
    title: "Analytics",
    description: "View website traffic and product performance",
    icon: BarChart,
    href: "/admin/analytics",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    status: "coming-soon"
  },
  {
    title: "User Management",
    description: "Manage admin users and permissions",
    icon: Users,
    href: "/admin/users",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    status: "coming-soon"
  },
  {
    title: "Settings",
    description: "Configure website settings and preferences",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    status: "coming-soon"
  }
]

export default function AdminDashboardClient() {
  return (
    <div className="container mx-auto py-10">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to Admin Dashboard</h1>
        <p className="text-gray-500">
          Select a feature below to manage your website content and settings.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminFeatures.map((feature) => (
          <Card
            key={feature.title}
            className={`relative p-6 hover:shadow-lg transition-shadow ${feature.bgColor} border-2 ${feature.borderColor}`}
          >
            {feature.status === "coming-soon" && (
              <div className="absolute top-4 right-4">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  Coming Soon
                </span>
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            
            {feature.status === "active" ? (
              <Link 
                href={feature.href}
                className={`inline-flex items-center text-sm font-medium ${feature.color} hover:opacity-80`}
              >
                Get Started
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <span className="text-sm text-gray-400">
                Available soon
              </span>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
} 
import { Metadata } from "next"
import AdminLayoutUI from "./admin-layout-ui"

export const metadata: Metadata = {
  title: "Admin Dashboard - Jatin Jewellers",
  description: "Admin dashboard for managing products and categories",
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutUI>{children}</AdminLayoutUI>
} 
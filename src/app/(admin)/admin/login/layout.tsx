import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login - Jatin Jewellers",
  description: "Login to access the admin dashboard",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
} 
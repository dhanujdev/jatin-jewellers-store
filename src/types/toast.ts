import { type ReactNode } from "react"
import { type ToastProps, type ToastActionElement } from "@/components/ui/toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
} 
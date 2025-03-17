"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"

export const columns: ColumnDef<Product>[] = [
  {
    id: "thumbnail",
    header: "Image",
    cell: ({ row }) => {
      const product = row.original
      const imagePath = `/products/${product.category}/${product.id}/image.jpg`
      
      return (
        <div className="relative h-12 w-12 rounded overflow-hidden">
          <Image
            src={imagePath}
            alt={product.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "original_type",
    header: "Type",
  },
  {
    accessorKey: "collection",
    header: "Collection",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.category}/${product.id}`}>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 
"use client"

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { forwardRef } from "react"
import "./toggleGroup.css" // Importar el CSS

export const ToggleGroup = forwardRef(({ className, children, type = "single", ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={`toggle-group ${className || ""}`}
    type={type} // "single" o "multiple"
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Root>
))
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

export const ToggleGroupItem = forwardRef(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Item ref={ref} className={`toggle-group-item ${className || ""}`} {...props}>
    {children}
  </ToggleGroupPrimitive.Item>
))
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

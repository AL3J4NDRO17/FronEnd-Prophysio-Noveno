"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"
import { forwardRef } from "react"
import "./select.css" // Importar el nuevo CSS para Select

// Select component (main wrapper)
export const Select = SelectPrimitive.Root

// SelectGroup (for grouping items, optional)
export const SelectGroup = SelectPrimitive.Group

// SelectValue (displays the selected value)
export const SelectValue = SelectPrimitive.Value

// SelectTrigger (the button that opens the dropdown)
export const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={`select-trigger ${className || ""}`} // Aplicar clase CSS personalizada
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="select-trigger-icon" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// SelectContent (the dropdown content itself)
export const SelectContent = forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={`select-content ${className || ""}`} // Aplicar clase CSS personalizada
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className={position === "popper" ? "select-viewport-popper" : "select-viewport"}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

// SelectItem (individual option in the dropdown)
export const SelectItem = forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={`select-item ${className || ""}`} // Aplicar clase CSS personalizada
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

// SelectLabel (for grouping items)
export const SelectLabel = forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={`select-label ${className || ""}`} // Aplicar clase CSS personalizada
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

// SelectSeparator (for separating items)
export const SelectSeparator = forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={`select-separator ${className || ""}`} // Aplicar clase CSS personalizada
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

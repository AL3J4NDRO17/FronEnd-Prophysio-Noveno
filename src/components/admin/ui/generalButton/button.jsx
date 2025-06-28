"use client"

import React from "react"
import "./button.css"

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button" // Using span for asChild, though typically it's a slot
    const baseClass = "appointmentsAdmin-btn"
    const variantClass = {
      default: "appointmentsAdmin-btn-primary", // Mapping default to primary for consistency with your design
      outline: "appointmentsAdmin-btn-outline",
      ghost: "appointmentsAdmin-btn-ghost", // Added for dropdown triggers if needed
      // Add other variants if necessary
    }[variant]

    const sizeClass = {
      default: "", // No specific size class for default, relies on base padding
      sm: "appointmentsAdmin-btn-sm",
      icon: "appointmentsAdmin-btn-icon",
      // Add other sizes if necessary
    }[size]

    return <Comp className={`${baseClass} ${variantClass} ${sizeClass} ${className || ""}`} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button }

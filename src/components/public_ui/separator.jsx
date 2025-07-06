"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

// Importa el archivo CSS específico para el separador
import "./separator.css"

const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    // Aplica clases CSS directamente
    className={`separator ${orientation === "horizontal" ? "separator-horizontal" : "separator-vertical"} ${className || ""}`}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

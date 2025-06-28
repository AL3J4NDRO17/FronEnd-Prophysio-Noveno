"use client"

import React from "react"
import "./label.css"

const Label = React.forwardRef(({ className, ...props }, ref) => {
  return <label className={`appointmentsAdmin-label ${className || ""}`} ref={ref} {...props} />
})
Label.displayName = "Label"

export { Label }

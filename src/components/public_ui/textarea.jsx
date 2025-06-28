"use client"

import React from "react"
import "./textarea.css"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return <textarea className={`appointmentsAdmin-textarea ${className || ""}`} ref={ref} {...props} />
})
Textarea.displayName = "Textarea"

export { Textarea }

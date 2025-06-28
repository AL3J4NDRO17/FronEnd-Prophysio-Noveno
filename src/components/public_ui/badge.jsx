"use client"

import React from "react"
import "./badge.css"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantClass = {
    default: "appointmentsAdmin-badge-default", // A generic default badge
    confirmed: "appointmentsAdmin-badge-confirmed",
    pending: "appointmentsAdmin-badge-pending",
    cancelled: "appointmentsAdmin-badge-cancelled",
    // Add other variants if needed
  }[variant]

  return <span className={`appointmentsAdmin-badge ${variantClass} ${className || ""}`} ref={ref} {...props} />
})
Badge.displayName = "Badge"

export { Badge }

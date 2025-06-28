"use client"

import React from "react"
import "./avatar.css"

const Avatar = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className={`appointmentsAdmin-avatar ${className || ""}`} ref={ref} {...props}>
      {children}
    </div>
  )
})
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  // In a real app, you'd use an <img> tag here
  // For placeholder, we'll just render nothing or a default if no fallback
  <img
    className={`appointmentsAdmin-avatar-image ${className || ""}`}
    ref={ref}
    alt="Avatar" // Add alt text for accessibility
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <div className={`appointmentsAdmin-avatar-fallback ${className || ""}`} ref={ref} {...props} />
))
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }

"use client"

import React from "react"
import "./card.css"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div className={`appointmentsAdmin-card ${className || ""}`} ref={ref} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div className={`appointmentsAdmin-card-header ${className || ""}`} ref={ref} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 className={`appointmentsAdmin-card-title ${className || ""}`} ref={ref} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p className={`appointmentsAdmin-card-description ${className || ""}`} ref={ref} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div className={`appointmentsAdmin-card-content ${className || ""}`} ref={ref} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div className={`appointmentsAdmin-card-footer ${className || ""}`} ref={ref} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }

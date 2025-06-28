"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import "./dropdown"

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef(null)
  const contentRef = useRef(null)

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        handleClose()
      }
    },
    [handleClose],
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        contentRef.current &&
        !contentRef.current.contains(event.target)
      ) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleClose, handleKeyDown])

  const trigger = React.Children.toArray(children).find((child) => child.type.displayName === "DropdownMenuTrigger")
  const content = React.Children.toArray(children).find((child) => child.type.displayName === "DropdownMenuContent")

  return (
    <div className="appointmentsAdmin-dropdown-menu">
      {trigger && React.cloneElement(trigger, { ref: triggerRef, onClick: handleToggle, "aria-expanded": isOpen })}
      {isOpen && content && React.cloneElement(content, { ref: contentRef, onKeyDown: handleKeyDown })}
    </div>
  )
}

const DropdownMenuTrigger = React.forwardRef(({ children, onClick, ...props }, ref) => {
  return React.cloneElement(children, {
    ref,
    onClick: (e) => {
      onClick && onClick(e)
      children.props.onClick && children.props.onClick(e)
    },
    ...props,
  })
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className={`appointmentsAdmin-dropdown-menu-content ${className || ""}`} ref={ref} {...props}>
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ className, onClick, ...props }, ref) => {
  return (
    <div
      className={`appointmentsAdmin-dropdown-menu-item ${className || ""}`}
      onClick={(e) => {
        onClick && onClick(e)
        // Close dropdown after item click
        const parentContent = e.currentTarget.closest(".appointmentsAdmin-dropdown-menu-content")
        if (parentContent) {
          const dropdownMenu = parentContent.closest(".appointmentsAdmin-dropdown-menu")
          if (dropdownMenu) {
            const trigger = dropdownMenu.querySelector("[aria-expanded]")
            if (trigger) {
              trigger.click() // Simulate click on trigger to close
            }
          }
        }
      }}
      ref={ref}
      tabIndex={0} // Make it focusable
      role="menuitem"
      {...props}
    />
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className={`appointmentsAdmin-dropdown-menu-separator ${className || ""}`}
    ref={ref}
    role="separator"
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div className={`appointmentsAdmin-dropdown-menu-label ${className || ""}`} ref={ref} {...props} />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
}

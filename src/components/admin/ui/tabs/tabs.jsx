"use client"

import * as React from "react"
import { cn } from "../cn/cn" // Asume que tienes un archivo utils.ts con la función cn
import "./tabs.css"

const TabsContext = React.createContext(null)

const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const controlledValue = value !== undefined ? value : internalValue
  const controlledOnValueChange = onValueChange || setInternalValue

  const contextValue = React.useMemo(
    () => ({
      value: controlledValue,
      onValueChange: controlledOnValueChange,
    }),
    [controlledValue, controlledOnValueChange],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("tab-container", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("tab-list", className)} role="tablist" {...props}>
    {children}
  </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component.")
  }

  const isActive = context.value === value

  return (
    <button
      ref={ref}
      className={cn("tab-trigger", isActive && "tab-active", className)}
      onClick={() => context.onValueChange(value)}
      role="tab"
      aria-selected={isActive}
      id={`tab-${value}`}
      aria-controls={`tabpanel-${value}`}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component.")
  }

  const isActive = context.value === value

  return isActive ? (
    <div
      ref={ref}
      className={cn("tab-content", className)}
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      {...props}
    >
      {children}
    </div>
  ) : null
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }

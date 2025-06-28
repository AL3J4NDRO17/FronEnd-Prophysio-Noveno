"use client"

import React from "react"
import "./select.css"

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select className={`appointmentsAdmin-select ${className || ""}`} ref={ref} {...props}>
      {children}
    </select>
  )
})
Select.displayName = "Select"

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  // This component is typically used with shadcn's Select, which has a custom trigger.
  // For a native select, the trigger is the select element itself.
  // We'll just render a div that looks like a trigger, but the actual select is the interactive part.
  // If you need a custom styled select, you'd need a more complex component with state.
  return (
    <div className={`appointmentsAdmin-select-trigger ${className || ""}`} ref={ref} {...props}>
      {children}
      {/* You might want an icon here */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="appointmentsAdmin-select-icon"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, children }) => {
  // This component is typically used to display the selected value.
  // For a native select, the value is shown by the browser.
  // We'll just render the children or placeholder.
  return children || placeholder
}
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
  // For a native select, the options are rendered directly inside the <select> tag.
  // This component is more relevant for custom dropdowns.
  // We'll just render the children.
  return (
    <div className={`appointmentsAdmin-select-content ${className || ""}`} ref={ref} {...props}>
      {children}
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => (
  <option className={`appointmentsAdmin-select-item ${className || ""}`} value={value} ref={ref} {...props}>
    {children}
  </option>
))
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

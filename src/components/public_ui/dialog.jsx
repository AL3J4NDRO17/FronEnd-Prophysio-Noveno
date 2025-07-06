"use client"

import { createContext, useContext, useEffect, useRef, useCallback, forwardRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import "./dialog.css" // Importar el CSS del Dialog
import { Button } from "./button" // Importar Button para el DialogHeader

const DialogContext = createContext(null)

export const Dialog = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef(null)

  const handleEscape = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden" // Prevenir scroll del body
      document.addEventListener("keydown", handleEscape)
    } else {
      document.body.style.overflow = "" // Restaurar scroll del body
      document.removeEventListener("keydown", handleEscape)
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "" // Asegurarse de restaurar el scroll al desmontar
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return createPortal(
    <DialogContext.Provider value={{ onClose }}>
      <div className="dialog-overlay" onClick={onClose}>
        {children} {/* DialogContent se renderizará aquí como un hijo */}
      </div>
    </DialogContext.Provider>,
    document.body, // Renderizar en el body
  )
}

// Componente DialogContent ahora definido aquí
export const DialogContent = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={`dialog-content-wrapper ${className || ""}`}
    role="dialog"
    aria-modal="true"
    onClick={(e) => e.stopPropagation()} // Evitar que el clic en el contenido cierre el modal
    {...props}
  >
    {children}
  </div>
))
DialogContent.displayName = "DialogContent"

export const DialogTrigger = ({ children, onClick }) => {
  return (
    <div className="dialog-trigger" onClick={onClick}>
      {children}
    </div>
  )
}

export const DialogHeader = ({ children }) => {
  const { onClose } = useContext(DialogContext)
  return (
    <div className="dialog-header">
      {children}
      <Button variant="ghost" size="icon" onClick={onClose} className="dialog-close-button">
        <X className="h-4 w-4" />
        <span className="sr-only">Cerrar</span>
      </Button>
    </div>
  )
}

export const DialogTitle = ({ children }) => {
  return <h2 className="dialog-title">{children}</h2>
}

export const DialogDescription = ({ children }) => {
  return <p className="dialog-description">{children}</p>
}

export const DialogFooter = ({ children }) => {
  return <div className="dialog-footer">{children}</div>
}

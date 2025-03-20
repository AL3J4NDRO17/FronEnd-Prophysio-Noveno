"use client"

import "./buttons.css"
import { Pen, Trash2, X, Plus, Upload, FileX, Eye, Filter, Settings, MoreVertical, ChevronDown } from "lucide-react"

/* 📝 Botón Editar */
export const EditButton = ({ onClick, className = "" }) => (
  <button title="Editar" className={`ui-btn ui-btnEdit ${className}`} onClick={onClick} aria-label="Editar">
    <Pen size={20} />
  </button>
)

/* 📤 Botón Publicar */
export const PublishButton = ({ onClick, className = "" }) => (
  <button title="Publicar" className={`ui-btn ui-btnPublish ${className}`} onClick={onClick} aria-label="Publicar">
    <Upload size={20} />
  </button>
)

/* ❌ Botón Despublicar */
export const UnpublishButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnUnpublish ${className}`} onClick={onClick} aria-label="Despublicar">
    <FileX size={20} />
  </button>
)

/* 👁️ Botón Ver Vista Previa */
export const SeePreviewButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnPreview ${className}`} onClick={onClick} aria-label="Ver vista previa">
    <Eye size={20} />
  </button>
)

/* 🗑️ Botón Eliminar */
export const DeleteButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnDelete ${className}`} onClick={onClick} aria-label="Eliminar">
    <Trash2 size={20} />
  </button>
)

/* ❌ Botón Cerrar */
export const CloseButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnClose ${className}`} onClick={onClick} aria-label="Cerrar">
    <X size={20} />
  </button>
)

/* ➕ Botón Nuevo Testimonio */
export const NewTestimonialButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnNuevo ${className}`} onClick={onClick} aria-label="Nuevo Testimonio">
    <Plus size={20} color="#ffffff" />
    Nuevo Testimonio
  </button>
)

/* 🔍 Botón Filtro */
export const FilterButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnFilter ${className}`} onClick={onClick} aria-label="Filtrar">
    <Filter size={20} />
    <span>Filtros</span>
    <ChevronDown size={16} />
  </button>
)

/* ⚙️ Botón Configuración */
export const SettingsButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnSettings ${className}`} onClick={onClick} aria-label="Configuración">
    <Settings size={20} />
  </button>
)

/* ⋮ Botón Más Opciones */
export const MoreButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnMore ${className}`} onClick={onClick} aria-label="Más opciones">
    <MoreVertical size={20} />
  </button>
)


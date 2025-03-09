"use client";

import "../buttons/buttons.css";
import { Pen, Trash2, X, Plus, Upload, FileX, Eye } from "lucide-react";

/* 📝 Botón Editar */
export const EditButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnEdit ${className}`} onClick={onClick} aria-label="Editar">
    <Pen size={20} />
  </button>
);

/* 📤 Botón Publicar */
export const PublishButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnPublish ${className}`} onClick={onClick} aria-label="Publicar">
    <Upload size={20}/>
  </button>
);

/* ❌ Botón Despublicar */
export const UnpublishButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnUnpublish ${className}`} onClick={onClick} aria-label="Despublicar">
    <FileX size={20} />
  </button>
);

/* 👁️ Botón Ver Vista Previa */
export const SeePreviewButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnPreview ${className}`} onClick={onClick} aria-label="Ver vista previa">
    <Eye size={20}  />
  </button>
);

/* 🗑️ Botón Eliminar */
export const DeleteButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnDelete ${className}`} onClick={onClick} aria-label="Eliminar">
    <Trash2 size={20}/>
  </button>
);

/* ❌ Botón Cerrar */
export const CloseButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnClose ${className}`} onClick={onClick} aria-label="Cerrar">
    <X size={20}  />
  </button>
);

/* ➕ Botón Nuevo Testimonio */
export const NewTestimonialButton = ({ onClick, className = "" }) => (
  <button className={`ui-btn ui-btnNuevo ${className}`} onClick={onClick} aria-label="Nuevo Testimonio">
    <Plus size={20} color="#ffffff" />
    Nuevo Testimonio
  </button>
);

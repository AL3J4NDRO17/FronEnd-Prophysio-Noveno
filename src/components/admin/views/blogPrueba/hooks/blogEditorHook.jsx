"use client"

import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createBlogService, updateBlogService } from "../services/blogService"
import { toast } from "react-toastify"
import { uploadImageToCloudinary } from "../services/cloudinaryService"

export function useBlogEditor(existingBlog, onClose, contentImageSize) {
  const queryClient = useQueryClient()

  const [blogData, setBlogData] = useState({
    bannerTitle: existingBlog?.bannerTitle || "",
    bannerImage: existingBlog?.bannerImage || null,
    title: existingBlog?.title || "",
    mainContent: existingBlog?.mainContent || "",
    effectsTitle: existingBlog?.effectsTitle || "",
    effectsContent: existingBlog?.effectsContent || "",
    author: existingBlog?.author || "",
    categoryId: existingBlog?.categoryId || "",
    contentImage: existingBlog?.contentImage || null,
    textStyle: existingBlog?.textStyle || {
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      color: "#000000",
      textAlign: "left",
    },
    status: existingBlog?.status || "draft",
    contentimagedimensions: existingBlog?.contentimagedimensions,
  })

  useEffect(() => {
    if (existingBlog) {
      setBlogData({
        bannerTitle: existingBlog.bannerTitle || "",
        bannerImage: existingBlog.bannerImage || null,
        title: existingBlog.title || "",
        mainContent: existingBlog.mainContent || "",
        effectsTitle: existingBlog.effectsTitle || "",
        effectsContent: existingBlog.effectsContent || "",
        author: existingBlog.author || "",
        categoryId: existingBlog.categoryId || "",
        contentImage: existingBlog.contentImage || null,
        textStyle: existingBlog.textStyle || {
          fontSize: "16px",
          fontFamily: "Arial, sans-serif",
          color: "#000000",
          textAlign: "left",
        },
        status: existingBlog.status || "draft",
        contentimagedimensions: existingBlog?.contentimagedimensions || "",
      })
    }
  }, [existingBlog])

  const isEditing = Boolean(existingBlog)

  const mutation = useMutation({
    mutationFn: isEditing ? (updatedBlog) => updateBlogService(existingBlog.id, updatedBlog) : createBlogService,
    onSuccess: () => {
      toast.success(isEditing ? "Blog actualizado" : "Blog creado")
      queryClient.invalidateQueries(["blogs"])
      onClose()
    },
    onError: (error) => {
      toast.error(`Error al guardar el blog: ${error.message}`)
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStyleChange = (property, value) => {
    setBlogData((prev) => ({
      ...prev,
      textStyle: {
        ...prev.textStyle,
        [property]: value,
      },
    }))
  }

  const handlePublish = async () => {
    // Validación
    if (!blogData.author.trim()) {
      toast.error("El autor es necesario")
      return
    }
    if (!blogData.categoryId || blogData.categoryId === "") {
      toast.error("Seleccione una categoría por favor")
      return
    }

    if (!blogData.title.trim()) {
      toast.error("El título es obligatorio")
      return
    }

   
    // Preparar datos para enviar al backend
    const blogToSend = {
      ...blogData,

    }

    mutation.mutate(blogToSend)
  }

  return {
    blogData,
    setBlogData,
    handleInputChange,
    handleStyleChange,
    handlePublish,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
  }
}


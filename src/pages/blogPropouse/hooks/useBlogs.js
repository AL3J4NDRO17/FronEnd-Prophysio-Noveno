"use client"

import { useState, useEffect } from "react"
import { useBlogs } from "./useClientBlog"

export function useBlog(blogId) {
  const [blog, setBlog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { fetchBlogIfMissing, isLoading: blogsLoading, error: blogsError } = useBlogs()

  useEffect(() => {
    async function loadBlog() {
      if (!blogId) return
        
      try {
        setIsLoading(true)
        const blogData = await fetchBlogIfMissing(blogId)

        if (!blogData) {
          setError("Blog no encontrado")
          return
        }

        setBlog(blogData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el blog")
      } finally {
        setIsLoading(false)
      }
    }

    loadBlog()
  }, [blogId, fetchBlogIfMissing])

  // Si hay un error en el hook useBlogs, propagarlo
  useEffect(() => {
    if (blogsError) {
      setError(blogsError)
    }
  }, [blogsError])

  return {
    blog,
    isLoading: isLoading || blogsLoading,
    error,
  }
}


"use client"

import { useState, useEffect } from "react"
import { useBlogs } from "./useClientBlog"
import { useCategories } from "./useClientCategories"

export function useRelatedBlogs(currentBlogId, categoryId, limit = 3) {
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { blogs, isLoading: blogsLoading } = useBlogs()
  const { categories, loading: categoriesLoading } = useCategories()

  useEffect(() => {
    if (blogsLoading || categoriesLoading || !currentBlogId) {
      return
    }
   
    setIsLoading(true)

    // Filtrar blogs relacionados por categoría y excluir el blog actual
    let related = blogs.filter(
      (blog) => 
        blog.id !== Number(currentBlogId) && 
        (categoryId ? blog.categoryId === Number(categoryId) : true) &&
        blog.status !== "draft" // ✅ Excluir los que tienen status "draft"
    );
    

    // Si no hay suficientes blogs en la misma categoría, agregar blogs de otras categorías
   

    // Agregar el nombre de la categoría a cada blog
    const blogsWithCategoryNames = related.map((blog) => {
      const category = categories.find((cat) => cat.id === Number(blog.categoryId))
      return {
        ...blog,
        categoryName: category ? category.nombre : "Sin categoría",
      }
    })

    setRelatedBlogs(blogsWithCategoryNames)
    setIsLoading(false)
  }, [blogs, categories, currentBlogId, categoryId, limit, blogsLoading, categoriesLoading])

  return {
    relatedBlogs,
    isLoading: isLoading || blogsLoading || categoriesLoading,
  }
}


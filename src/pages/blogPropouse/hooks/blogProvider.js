"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { fetchBlogs } from "../services/blogClientServices"

const BlogContext = createContext()

export function BlogProvider({ children }) {
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await fetchBlogs()
        setBlogs(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar blogs")
      } finally {
        setIsLoading(false)
      }
    }
    loadBlogs()
  }, [])

  return (
    <BlogContext.Provider value={{ blogs, isLoading, error }}>
      {children}
    </BlogContext.Provider>
  )
}

export function useBlogContext() {
  return useContext(BlogContext)
}

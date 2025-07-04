"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { getCategories } from "../services/blogClientServices"

const CategoryContext = createContext()

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar categorías")
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  return (
    <CategoryContext.Provider value={{ categories, loading, error }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategoryContext() {
  return useContext(CategoryContext)
}

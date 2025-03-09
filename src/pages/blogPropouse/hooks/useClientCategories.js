"use client"

import { useState, useEffect } from "react"
import { getCategories } from "../services/blogClientServices"

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getCategories()
        setCategories(response)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}


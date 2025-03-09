"use client"

import { useState } from "react"
import "../styles/blogFilters.css"

export default function BlogFilters({ posts = [], onFilterChange }) {
  const [filters, setFilters] = useState({
    selectedCategories: [],
    selectedAuthors: [],
    startDate: "",
    endDate: "",
  })

  const categories = [...new Set(posts.map((post) => post.category))]
  const authors = [...new Set(posts.map((post) => post.author))]

  const handleFilterChange = (type, value) => {
    setFilters((prev) => {
      if (type === "selectedCategories" || type === "selectedAuthors") {
        return {
          ...prev,
          [type]: prev[type].includes(value) ? prev[type].filter((item) => item !== value) : [...prev[type], value],
        }
      }
      return { ...prev, [type]: value }
    })
  }

  const applyFilters = () => {
    onFilterChange(filters)
  }

  const resetFilters = () => {
    setFilters({
      selectedCategories: [],
      selectedAuthors: [],
      startDate: "",
      endDate: "",
    })
    onFilterChange({
      selectedCategories: [],
      selectedAuthors: [],
      startDate: "",
      endDate: "",
    })
  }

  return (
    <div className="blog-filters">
      <div className="filter-header">
        <h3>Filtrar por:</h3>
        <button className="reset-filters-btn" onClick={resetFilters} title="Resetear filtros">
          &#x21bb;
        </button>
      </div>

      <div className="filter-section">
        <h4>Autores</h4>
        <div className="filter-options">
          {authors.map((author) => (
            <label key={author} className="filter-option">
              <input
                type="checkbox"
                checked={filters.selectedAuthors.includes(author)}
                onChange={() => handleFilterChange("selectedAuthors", author)}
              />
              <span>{author}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Rango de fecha</h4>
        <div className="date-inputs">
          <div className="date-input-wrapper">
            <label htmlFor="start-date">De:</label>
            <input
              id="start-date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="date-input"
            />
          </div>
          <div className="date-input-wrapper">
            <label htmlFor="end-date">A:</label>
            <input
              id="end-date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="date-input"
            />
          </div>
        </div>
      </div>

      <button className="apply-filters-btn" onClick={applyFilters}>
        Aplicar Filtros
      </button>
    </div>
  )
}

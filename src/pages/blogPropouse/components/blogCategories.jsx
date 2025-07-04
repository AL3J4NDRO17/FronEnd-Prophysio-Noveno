"use client"

import { useState } from "react"

import "../styles/blogCategories.css"
import { useCategoryContext } from "../hooks/categoryProvider"

export default function BlogFiltersUnificado({ posts = [], onFilterChange, onCategoryClick }) {
  const { categories, loading, error } = useCategoryContext()

  // Estado para los filtros seleccionados (pero no aplicados aún)
  const [filters, setFilters] = useState({
    selectedCategories: [],
    selectedAuthors: [],
    startDate: "",
    endDate: "",
  })

  const authors = [...new Set(posts.map((post) => post.author))]

  // Actualiza el estado de los filtros seleccionados, pero no aplica los cambios
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

  // Aplica todos los filtros cuando se hace clic en el botón
  const applyFilters = () => {
    // Notifica al componente padre sobre los filtros aplicados
    onFilterChange(filters)
  }

  // Resetea los filtros
  const resetFilters = () => {
    const emptyFilters = {
      selectedCategories: [],
      selectedAuthors: [],
      startDate: "",
      endDate: "",
    }

    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  return (
    <div className="blog-filters">
      <div className="filter-header">
        <h3>Filtrar por:</h3>
        <button className="reset-filters-btn" onClick={resetFilters} title="Resetear filtros">
          &#x21bb;
        </button>
      </div>

      {/* Sección de categorías - Ahora con checkboxes como los autores */}
      <div className="filter-section">
        <h4>Categorías</h4>
        {loading ? (
          <div className="loading-message">Cargando categorías...</div>
        ) : error ? (
          <div className="error-message">Error cargando categorías.</div>
        ) : (
          <div className="filter-options">
            {categories.map((category) => (
              <label key={category.id} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.selectedCategories.includes(category.id)}
                  onChange={() => handleFilterChange("selectedCategories", category.id)}
                />
                <span>{category.nombre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sección de autores */}
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

      {/* Sección de rango de fechas */}
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


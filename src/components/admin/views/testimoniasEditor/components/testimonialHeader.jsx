"use client"

import { Search } from "lucide-react"
import { NewTestimonialButton, FilterButton, SettingsButton, MoreButton } from "@uiButtons"

const TestimonialsHeader = ({
  onAddNew,
  searchTerm,
  setSearchTerm,
  filterAprobado,
  setFilterAprobado,
  sortBy,
  setSortBy,
  sortOrder,
  toggleSortOrder,
}) => {
  return (
    <div className="adminDashboard-testimonials-header">
      <div className="adminDashboard-testimonials-header-left">
        <h1 className="adminDashboard-testimonials-title">Gestión de Testimonios</h1>
      </div>

      <div className="adminDashboard-testimonials-header-right">
        <div className="adminDashboard-search-container">
          <Search className="adminDashboard-search-icon" />
          <input
            type="text"
            placeholder="Buscar testimonios..."
            className="adminDashboard-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <FilterButton onClick={() => {}} className="adminDashboard-filter-button" />

        <div className="adminDashboard-select-container">
          <select className="adminDashboard-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="fecha">Fecha</option>
            <option value="nombre">Nombre</option>
            <option value="puntaje">Puntuación</option>
          </select>
          <button className="adminDashboard-sort-button" onClick={toggleSortOrder}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>

        <NewTestimonialButton onClick={onAddNew} />

        <SettingsButton onClick={() => {}} />

        <MoreButton onClick={() => {}} />
      </div>
    </div>
  )
}

export default TestimonialsHeader


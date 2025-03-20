"use client"

import { Search, Filter, SlidersHorizontal } from "lucide-react"

const TestimonialsFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  toggleSortOrder,
  filterRating,
  setFilterRating,
  filterService,
  setFilterService,
  dateRange,
  setDateRange,
  resetFilters,
  services,
  showAdvancedFilters,
  setShowAdvancedFilters,
}) => {
  return (
    <div className="adminDashboard-testimonials-filters-container">
      <div className="adminDashboard-testimonials-filters-main">
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

        <div className="adminDashboard-testimonials-filter-actions">
          <div className="adminDashboard-filter-group">
            <Filter className="adminDashboard-filter-icon" />
            <select
              className="adminDashboard-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>

          <div className="adminDashboard-filter-group">
            <select className="adminDashboard-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Fecha</option>
              <option value="name">Nombre</option>
              <option value="rating">Calificación</option>
              <option value="service">Servicio</option>
            </select>
            <button className="adminDashboard-sort-button" onClick={toggleSortOrder}>
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      <div className="adminDashboard-testimonials-filters-advanced">
        <button
          className="adminDashboard-testimonials-advanced-filter-button"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <SlidersHorizontal className="adminDashboard-button-icon-small" />
          Filtros avanzados
        </button>

        {showAdvancedFilters && (
          <div className="adminDashboard-testimonials-advanced-filters">
            <div className="adminDashboard-testimonials-filter-row">
              <div className="adminDashboard-testimonials-filter-group">
                <label>Calificación</label>
                <select
                  className="adminDashboard-select"
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                >
                  <option value="all">Todas</option>
                  <option value="5">5 estrellas</option>
                  <option value="4">4 estrellas</option>
                  <option value="3">3 estrellas</option>
                  <option value="2">2 estrellas</option>
                  <option value="1">1 estrella</option>
                </select>
              </div>

              <div className="adminDashboard-testimonials-filter-group">
                <label>Servicio</label>
                <select
                  className="adminDashboard-select"
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                >
                  <option value="all">Todos</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className="adminDashboard-testimonials-filter-group">
                <label>Fecha</label>
                <div className="adminDashboard-testimonials-date-range">
                  <input
                    type="date"
                    className="adminDashboard-input-date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                  <span>a</span>
                  <input
                    type="date"
                    className="adminDashboard-input-date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="adminDashboard-testimonials-filter-actions">
              <button className="adminDashboard-secondary-button-small" onClick={resetFilters}>
                Limpiar filtros
              </button>
              <button className="adminDashboard-primary-button-small" onClick={() => setShowAdvancedFilters(false)}>
                Aplicar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestimonialsFilters


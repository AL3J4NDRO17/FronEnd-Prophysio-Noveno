"use client"
import { Plus, Search, Filter, Settings, MoreVertical } from "lucide-react"

export default function BlogHeader({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  setIsModalOpen,
  setIsConfigOpen,
}) {
  return (
    <div className="blogAdmin-header">
      <div className="blogAdmin-header-title">
        <h1>Gestión de Blogs</h1>
      </div>

      <div className="blogAdmin-header-controls">
        <div className="blogAdmin-search-container">
          <Search className="blogAdmin-search-icon" />
          <input
            type="text"
            placeholder="Buscar posts..."
            className="blogAdmin-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="blogAdmin-filter-group">
          <Filter className="blogAdmin-filter-icon" />
          <select className="blogAdmin-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Todos</option>
            <option value="published">Publicados</option>
            <option value="draft">Borradores</option>
          </select>
        </div>

        <div className="blogAdmin-sort-group">
          <select className="blogAdmin-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="title">Título</option>
            <option value="author">Autor</option>
            <option value="publishDate">Fecha</option>
            <option value="status">Estado</option>
          </select>
          <button className="blogAdmin-sort-button" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>

        <div className="blogAdmin-header-actions">
          <button className="blogAdmin-primary-button" onClick={() => setIsModalOpen(true)}>
            <Plus className="blogAdmin-button-icon" />
            <span className="blogAdmin-button-text">Nuevo Post</span>
          </button>
          <button className="blogAdmin-icon-button" onClick={() => setIsConfigOpen(true)}>
            <Settings className="blogAdmin-icon" />
          </button>
          <button className="blogAdmin-icon-button">
            <MoreVertical className="blogAdmin-icon" />
          </button>
        </div>
      </div>
    </div>
  )
}


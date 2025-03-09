import React from 'react'
import { Search, Filter } from 'lucide-react'

import "../styles/blogAdmin.css"
import "../styles/modal.css"


export default function BlogFilters({ 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus, 
  sortBy, 
  setSortBy, 
  sortOrder, 
  setSortOrder 
}) {
  return (
    <div className="blogAdmin-filters">
      <div className="blogAdmin-search-container">
        <Search className="blogAdmin-search-icon" />
        <input
          type="text"
          placeholder="Search posts..."
          className="blogAdmin-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="blogAdmin-filter-actions">
        <div className="blogAdmin-filter-group">
          <Filter className="blogAdmin-filter-icon" />
          <select
            className="blogAdmin-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="blogAdmin-filter-group">
          <select
            className="blogAdmin-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="publishDate">Date</option>
            <option value="status">Status</option>
          </select>
          <button
            className="blogAdmin-sort-button"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>
    </div>
  )
}

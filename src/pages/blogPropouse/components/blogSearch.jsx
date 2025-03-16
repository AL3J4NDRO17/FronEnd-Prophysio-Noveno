"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import "../styles/BlogSearch.css"

export default function BlogSearch({ blogs = [], onSearch }) {
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const lowercasedTerm = searchTerm.toLowerCase()
    const filtered = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(lowercasedTerm)
    )
    onSearch(filtered)
  }

  const handleNavigate = (id) => {
    navigate(`/blog/${id}`)
    setSearchTerm("")
  }

  const highlightMatch = (text, term) => {
    if (!term.trim()) return text
    const regex = new RegExp(`(${term})`, "gi")
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    )
  }

  return (
    <div className="tech_blog_search_outer">
      <form onSubmit={handleSearch} className="tech_blog_search_form">
        <input
          type="text"
          placeholder="Buscar artículos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="tech_blog_search_input"
          aria-label="Buscar en el blog"
        />
        <button type="submit" className="tech_blog_search_button">
          <FaSearch />
        </button>
      </form>

      {searchTerm.trim() && (
        <ul className="search-results">
          {blogs.filter((blog) => blog.title.toLowerCase().includes(searchTerm.toLowerCase())).map((blog) => (
            <li key={blog.id} className="search-item" onClick={() => handleNavigate(blog.id)}>
              <h3>{highlightMatch(blog.title, searchTerm)}</h3>
              <p className="">
                {blog.mainContent ? `${blog.mainContent.substring(0, 100)}...` : 'No disponible'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

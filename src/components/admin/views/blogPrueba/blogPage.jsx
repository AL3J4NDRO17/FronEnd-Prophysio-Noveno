"use client"

import { useState } from "react"
import { useBlogs } from "./hooks/useBlogs"
import { useCategories } from "./hooks/useConfig"

import BlogGrid from "./components/grid"
import BlogModal from "./components/modal"
import BlogConfig from "./components/blogConfig"
import BlogHeader from "./components/header"
import BlogSummary from "./components/summary"

import "./styles/blogConfig.css"
import "./styles/blogAdmin.css"
import "./styles/modal.css"
import "./styles/summary.css"
import "./styles/header.css"

export default function BlogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  // Usamos los hooks proporcionados para obtener datos
  const { blogs = [], isLoading, deleteBlog, updateStatusBlog } = useBlogs()
  const { categories, loadingCategories } = useCategories()
  // No necesitas handlePublish aquí, ya que se pasa al modal y el modal lo llama.
  // const { handlePublish } = useBlogEditor()

  // Lógica para abrir el editor de blogs
  const handleEdit = (blog) => {
    setSelectedBlog(blog)
    setIsModalOpen(true)
  }

  // Lógica para eliminar el blog
  const handleDelete = (blogId) => {
    deleteBlog.mutate(blogId)
  }

  // Lógica para cambiar el estado del blog (borrador/publicado)
  const handleStatusChange = (blog) => {
    const newStatus = blog.status === "draft" ? "published" : "draft"
    updateStatusBlog.mutate({ id: blog.id, status: newStatus })
  }

  // Función para ordenar los blogs
  const sortBlogs = (blogsToSort) => {
    return [...blogsToSort].sort((a, b) => {
      let compareA = a[sortBy]
      let compareB = b[sortBy]

      if (sortBy === "publishDate") {
        compareA = new Date(compareA)
        compareB = new Date(compareB)
      }

      if (sortOrder === "asc") {
        return compareA > compareB ? 1 : -1
      }
      return compareA < compareB ? 1 : -1
    })
  }

  // Filtrado y ordenado de blogs
  const filteredAndSortedBlogs = sortBlogs(
    blogs.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "all" ? true : post.status === filterStatus
      return matchesSearch && matchesStatus
    }),
  )

  if (loadingCategories) {
    return <div>Loading categories...</div>
  }

  return (
    <div className="blogAdmin-container">
      <BlogHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        setIsModalOpen={setIsModalOpen}
        setIsConfigOpen={setIsConfigOpen}
      />

      <div className="blogAdmin-content">
        <div className="blogAdmin-layout">
          <div className="blogAdmin-main">
            {isLoading ? (
              <div className="blogAdmin-loading">Cargando blogs...</div>
            ) : (
              <BlogGrid
                blogs={filteredAndSortedBlogs}
                categories={categories}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleStatusChange={handleStatusChange}
                setIsModalOpen={setIsModalOpen}
              />
            )}
          </div>

          <div className="blogAdmin-sidebar">
            <BlogSummary blogs={blogs} />
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <BlogModal
          isOpen={isModalOpen}
          onClose={() => {
            localStorage.clear()
            setIsModalOpen(false)
            setSelectedBlog(null)
          }}
          // onSubmit={handlePublish} // handlePublish is now managed internally by useBlogEditor
          existingBlog={selectedBlog}
          categories={categories}
        />
      )}

      {/* Config Modal */}
      {isConfigOpen && <BlogConfig isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />}
    </div>
  )
}

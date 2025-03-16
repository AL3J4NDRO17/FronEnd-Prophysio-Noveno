'use client';

import { useState, useEffect } from "react";
import { useCategories } from "../hooks/useConfig";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";


const BlogConfig = ({ isOpen, onClose }) => {
  const { categories, loading, addCategory, editCategory, removeCategory } = useCategories()
  const [newCategory, setNewCategory] = useState("")
  const [editingIndex, setEditingIndex] = useState(-1)
  const [activeSection, setActiveSection] = useState("categories")

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      addCategory(newCategory.trim())
      setNewCategory("")
    }
  }

  const handleDeleteCategory = (index) => {
    removeCategory(categories[index].id)
  }

  const handleEditCategory = (index) => {
    setEditingIndex(index)
  }

  const handleSaveEdit = (index, newValue) => {
    editCategory(categories[index].id, newValue)
    setEditingIndex(-1)
  }

  const handleCancelEdit = () => {
    setEditingIndex(-1)
  }

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  if (!isOpen) return null

  return (
    <div className="blogAdminOverlay">
      <div className="blogAdminModal">
        <div className="blogAdminHeader">
          <h2>Blog Configuration</h2>
          <button className="blogAdminCloseBtn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="blogAdminSection">
          <div className="blogAdminSectionHeader" onClick={() => toggleSection("categories")}>
            <h3>Categories</h3>
            {activeSection === "categories" ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {activeSection === "categories" && (
            <div className="blogAdminSectionContent">
              <div className="blogAdminCategoryWrapper">
                {loading ? (
                  <div className="blogAdminLoadingState">Loading categories...</div>
                ) : categories.length > 0 ? (
                  categories.map((category, index) => (
                    <div key={category.id} className="blogAdminCategoryItem">
                      {editingIndex === index ? (
                        <input
                          type="text"
                          value={category.nombre}
                          className="blogAdminCategoryInput"
                          onChange={(e) => {
                            const updatedCategories = [...categories];
                            updatedCategories[index].nombre = e.target.value;
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleSaveEdit(index, e.target.value);
                            }
                          }}
                        />
                      ) : (
                        <span className="blogAdminCategoryName">{category.nombre}</span>
                      )}
                      <div className="blogAdminCategoryControls">
                        {editingIndex === index ? (
                          <>
                            <button className="blogAdminActionBtn blogAdminSaveBtn" onClick={() => handleSaveEdit(index, categories[index].nombre)}>
                              <FaSave />
                            </button>
                            <button className="blogAdminActionBtn blogAdminCancelBtn" onClick={handleCancelEdit}>
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="blogAdminActionBtn blogAdminEditBtn" onClick={() => handleEditCategory(index)}>
                              <FaEdit />
                            </button>
                            <button className="blogAdminActionBtn blogAdminDeleteBtn" onClick={() => handleDeleteCategory(index)}>
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="blogAdminEmptyState">No categories available.</div>
                )}
              </div>

              <div className="blogAdminCategoryCreator">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                  className="blogAdminCategoryInput"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddCategory()
                    }
                  }}
                />
                <button className="blogAdminAddBtn" onClick={handleAddCategory}>
                  <FaPlus /> Add Category
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogConfig

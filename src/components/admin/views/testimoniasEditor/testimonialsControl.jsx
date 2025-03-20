"use client"

import { useState, useMemo } from "react"
import useTestimonials from "./hooks/useTestimonials"

import TestimonialsHeader from "./components/testimonialHeader"
import TestimonialsList from "./components/testimonialList"
import TestimonialModal from "./components/testimonialModal"
import TestimonialsStats from "./components/testimonialSummary"
import "./styles/testimonialsControl.css"

const TestimonialsManager = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(null)

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAprobado, setFilterAprobado] = useState("all")
  const [sortBy, setSortBy] = useState("fecha")
  const [sortOrder, setSortOrder] = useState("desc")
  const [filterPuntaje, setFilterPuntaje] = useState("all")

  // Usar nuestro hook de testimonios
  const {
    testimonios,
    loading,
    createMutation,
    updateMutation,
    handleDeleteTestimonio,
    updateStatusMutation,
    testimonialStats,
    fetchTestimonioById,





  } = useTestimonials()

  // Aplicar filtros solo cuando sea necesario usando useMemo
  const filteredTestimonials = useMemo(() => {
    // Solo aplicar filtros si hay algún filtro activo
    const hasActiveFilters = searchTerm !== "" || filterAprobado !== "all" || filterPuntaje !== "all"

    // Si no hay filtros activos, devolver todos los testimonios
    if (!hasActiveFilters && sortBy === "fecha" && sortOrder === "desc") {
      return testimonios
    }

    // Aplicar filtros solo cuando sea necesario
    return testimonios
      .filter((t) => {
        // Búsqueda por texto (solo si hay término de búsqueda)
        const matchesSearch =
          searchTerm === "" ||
          t.nombre_usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.comentarios?.toLowerCase().includes(searchTerm.toLowerCase())

        // Filtro por estado de aprobación (solo si hay filtro activo)
        const matchesAprobado =
          filterAprobado === "all" ||
          (filterAprobado === "true" && t.aprobado === true) ||
          (filterAprobado === "false" && t.aprobado === false)

        // Filtro por puntuación (solo si hay filtro activo)
        const matchesPuntaje = filterPuntaje === "all" || t.puntaje === Number.parseInt(filterPuntaje)

        return matchesSearch && matchesAprobado && matchesPuntaje
      })
      .sort((a, b) => {
        let compareA, compareB

        switch (sortBy) {
          case "nombre":
            compareA = a.nombre_usuario || ""
            compareB = b.nombre_usuario || ""
            break
          case "puntaje":
            compareA = a.puntaje || 0
            compareB = b.puntaje || 0
            break
          case "fecha":
          default:
            compareA = new Date(a.creado_el || a.createdAt || 0)
            compareB = new Date(b.creado_el || b.createdAt || 0)
        }

        return sortOrder === "asc" ? (compareA > compareB ? 1 : -1) : compareA < compareB ? 1 : -1
      })
  }, [testimonios, searchTerm, filterAprobado, sortBy, sortOrder, filterPuntaje])

  // Resetear filtros
  const resetFilters = () => {
    setSearchTerm("")
    setFilterAprobado("all")
    setSortBy("fecha")
    setSortOrder("desc")
    setFilterPuntaje("all")
  }

  // Cambiar orden
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  // Abrir modal para crear/editar
  const handleOpenModal = (testimonial = null) => {
    setCurrentTestimonial(testimonial)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTestimonial(null);  // ✅ Limpia los datos al cerrar el modal
  };

  // Guardar un testimonio (crear o actualizar)
  const handleSaveTestimonial = (testimonialData) => {
    console.log(testimonialData)
    if (testimonialData.id_testimonio) {
      updateMutation.mutate({ id: testimonialData.id_testimonio, testimonioData: testimonialData });
    } else {
      createMutation.mutate(testimonialData);
    }

    handleCloseModal();
  };

  // Manejar cambio de estado (aprobado/pendiente)
  const handleToggleAprobado = (id, aprobado) => {
    updateStatusMutation(id, aprobado)
  }

  return (
    <div className="adminDashboard-testimonials-container">
      {/* Header con filtros integrados */}
      <TestimonialsHeader
        onAddNew={() => handleOpenModal()}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterAprobado={filterAprobado}
        setFilterAprobado={setFilterAprobado}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        toggleSortOrder={toggleSortOrder}
      />

      {/* Lista de testimonios */}
      <TestimonialsList
        testimonials={filteredTestimonials}
        isLoading={loading}
        onEdit={handleOpenModal}
        onDelete={handleDeleteTestimonio}
        onToggleAprobado={(id, status) => updateStatusMutation.mutate({ id, status })}  // ✅ Corrección
        onAddNew={() => handleOpenModal()}
      />



      {/* Estadísticas */}
      <TestimonialsStats testimonials={testimonios} />

      {/* Modal para crear/editar testimonios */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTestimonial}
        testimonial={currentTestimonial}
      />
    </div>
  )
}


export default TestimonialsManager

"use client"

import { useState, useEffect } from "react"
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink as updateSocialLinkService,
  deleteSocialLink as deleteSocialLinkService,
} from "../services/socialService"
import { toast } from "react-toastify"
import Swal from "sweetalert2"

const useSocialLinks = (companyId) => {
  
  const [socialLinks, setSocialLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!companyId) {
      setLoading(false)
      return
    }

    const fetchSocialLinks = async () => {
      setLoading(true)
      try {
        const data = await getSocialLinks(companyId)
        setSocialLinks(data || [])
      } catch (err) {
        setError(err.message)
        toast.error("Error al cargar las redes sociales.")
      } finally {
        setLoading(false)
      }
    }

    fetchSocialLinks()
  }, [companyId])

  const addSocialLink = async (newLink) => {
    setIsSubmitting(true)
    try {
      const savedLink = await createSocialLink({
        ...newLink,
        company_id: companyId,
      })
      setSocialLinks((prevLinks) => [...prevLinks, savedLink])
      toast.success("Red social agregada correctamente.")
      return savedLink
    } catch (err) {
      setError(err.message)
      toast.error("Error al agregar red social.")
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateSocialLink = async (id, updatedLink) => {
    setIsSubmitting(true)
    try {
      const updated = await updateSocialLinkService(id, updatedLink)
      setSocialLinks((prevLinks) => prevLinks.map((link) => (link.social_id === id ? updated : link)))
      toast.success("Red social actualizada correctamente.")
      return updated
    } catch (err) {
      setError(err.message)
      toast.error("Error al actualizar red social.")
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeSocialLink = async (id) => {
    // Reemplazar `confirm` con SweetAlert2
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (!result.isConfirmed) {
      return
    }

    setIsSubmitting(true)
    try {
      await deleteSocialLinkService(id)
      setSocialLinks((prevLinks) => prevLinks.filter((link) => link.social_id !== id))
      toast.success("Red social eliminada correctamente.")
    } catch (err) {
      setError(err.message)
      toast.error("Error al eliminar red social.")
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    socialLinks,
    loading,
    error,
    isSubmitting,
    addSocialLink,
    updateSocialLink,
    removeSocialLink,
  }
}

export default useSocialLinks

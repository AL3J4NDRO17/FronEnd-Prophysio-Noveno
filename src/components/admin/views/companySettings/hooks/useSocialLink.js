"use client"

import { useState, useEffect } from "react"
import { getSocialLinks, createSocialLink, deleteSocialLink } from "../services/socialService"
import { toast } from "react-toastify"

const useSocialLinks = (companyId) => {
  const [socialLinks, setSocialLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!companyId) return

    const fetchSocialLinks = async () => {
      try {
        const data = await getSocialLinks(companyId)
        setSocialLinks(data)
      } catch (err) {
        setError(err.message)
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
      setSocialLinks([...socialLinks, savedLink])
      toast.success("Red social agregada correctamente")
      return savedLink
    } catch (err) {
      setError(err.message)
      toast.error("Error al agregar red social")
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateSocialLink = async (id, updatedLink) => {
    setIsSubmitting(true)
    try {
      const updated = await updateSocialLink(id, updatedLink)
      setSocialLinks(socialLinks.map((link) => (link.id === id ? updated : link)))
      toast.success("Red social actualizada correctamente")
      return updated
    } catch (err) {
      setError(err.message)
      toast.error("Error al actualizar red social")
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeSocialLink = async (id) => {
    setIsSubmitting(true)
    try {
      await deleteSocialLink(id)
      setSocialLinks(socialLinks.filter((link) => link.id !== id))
      toast.success("Red social eliminada correctamente")
    } catch (err) {
      setError(err.message)
      toast.error("Error al eliminar red social")
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


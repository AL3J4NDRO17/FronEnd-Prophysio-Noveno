"use client"

import { useState, useEffect } from "react"
import {
  getFaqs,
  createFaq,
  updateFaq as updateFaqService,
  deleteFaq as deleteFaqService,
} from "../services/faqService"
import { toast } from "react-toastify"

const useFaqs = (companyId) => {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!companyId) {
      setLoading(false)
      return
    }

    const fetchFaqs = async () => {
      setLoading(true)
      try {
        const data = await getFaqs(companyId)
        setFaqs(data.faqs || [])
      } catch (err) {
        setError(err.message)
        toast.error("Error al cargar las FAQs.")
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [companyId])

  const addFaq = async (newFaq) => {
    try {
      const savedFaq = await createFaq(newFaq)
      setFaqs((prevFaqs) => [...prevFaqs, savedFaq])
      toast.success("FAQ agregada correctamente.")
      return savedFaq
    } catch (err) {
      setError(err.message)
      toast.error("Error al agregar FAQ.")
      throw err
    }
  }

  const updateFaq = async (id, updatedFaq) => {
    try {
      const updated = await updateFaqService(id, updatedFaq)
      setFaqs((prevFaqs) => prevFaqs.map((faq) => (faq.faq_id === id ? updated : faq)))
      toast.success("FAQ actualizada correctamente.")
      return updated
    } catch (err) {
      setError(err.message)
      toast.error("Error al actualizar FAQ.")
      throw err
    }
  }

  const deleteFaq = async (id) => {
    try {
      await deleteFaqService(id)
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.faq_id !== id))
      toast.success("FAQ eliminada correctamente.")
    } catch (err) {
      setError(err.message)
      toast.error("Error al eliminar FAQ.")
      throw err
    }
  }

  return { faqs, loading, error, addFaq, updateFaq, deleteFaq }
}

export default useFaqs

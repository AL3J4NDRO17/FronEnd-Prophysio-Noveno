"use client"

import { useState } from "react"
import { PlusCircle, Edit, Trash2, Save, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "react-toastify" // Usar react-toastify
import Swal from "sweetalert2" // Usar SweetAlert2

export default function FaqsManagement({ faqs, loading, error, addFaq, updateFaq, deleteFaq, companyId }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentFaq, setCurrentFaq] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [expandedFaqs, setExpandedFaqs] = useState({})

  const handleAddFaq = () => {
    setCurrentFaq({ company_id: companyId, question: "", answer: "" })
    setIsDialogOpen(true)
  }

  const handleEditFaq = (faq) => {
    setCurrentFaq({ ...faq })
    setIsDialogOpen(true)
  }

  const handleDeleteFaq = async (faqId) => {
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

    if (!result.isConfirmed) return

    try {
      await deleteFaq(faqId)
      toast.success("FAQ eliminada correctamente.")
    } catch (err) {
      toast.error("Error al eliminar FAQ.")
      console.error(err)
    }
  }

  const handleSaveFaq = async () => {
    if (!currentFaq || !currentFaq.question.trim() || !currentFaq.answer.trim()) {
      toast.error("La pregunta y la respuesta no pueden estar vacías.")
      return
    }

    setIsSaving(true)
    try {
      if (currentFaq.faq_id) {
        await updateFaq(currentFaq.faq_id, {
          question: currentFaq.question,
          answer: currentFaq.answer,
        })
      } else {
        await addFaq({
          company_id: companyId,
          question: currentFaq.question,
          answer: currentFaq.answer,
        })
      }
      setIsDialogOpen(false)
      toast.success("FAQ guardada correctamente.")
    } catch (err) {
      toast.error("Error al guardar la FAQ.")
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleFaqExpand = (id) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (loading) {
    return <div className="companySettings-loading">Cargando FAQs...</div>
  }

  if (error) {
    return <div className="companySettings-error">Error: {error}</div>
  }

  return (
    <div className="companySettings-card">
      <div className="companySettings-card-header">
        <h2>Preguntas Frecuentes</h2>
        <button onClick={handleAddFaq} className="companySettings-button-primary" disabled={isSaving}>
          <PlusCircle className="companySettings-button-icon" />
          Añadir FAQ
        </button>
      </div>
      <div className="companySettings-card-content">
        {faqs.length === 0 ? (
          <p className="companySettings-no-results">No hay FAQs registradas.</p>
        ) : (
          <div className="companySettings-faq-list">
            {faqs.map((faq) => (
              <div key={faq.faq_id} className="companySettings-faq-item">
                <div className="companySettings-faq-header" onClick={() => toggleFaqExpand(faq.faq_id)}>
                  <div className="companySettings-faq-question">
                    <h3>{faq.question}</h3>
                    {expandedFaqs[faq.faq_id] ? (
                      <ChevronUp className="companySettings-faq-toggle" />
                    ) : (
                      <ChevronDown className="companySettings-faq-toggle" />
                    )}
                  </div>
                  <div className="companySettings-faq-actions">
                    <button
                      className="companySettings-icon-button-small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditFaq(faq)
                      }}
                    >
                      <Edit className="companySettings-icon-small" />
                    </button>
                    <button
                      className="companySettings-icon-button-small companySettings-button-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteFaq(faq.faq_id)
                      }}
                    >
                      <Trash2 className="companySettings-icon-small" />
                    </button>
                  </div>
                </div>
                {expandedFaqs[faq.faq_id] && (
                  <div className="companySettings-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isDialogOpen && (
          <div className="companySettings-dialog-overlay">
            <div className="companySettings-dialog-content">
              <div className="companySettings-dialog-header">
                <h3 className="companySettings-dialog-title">
                  {currentFaq?.faq_id ? "Editar FAQ" : "Añadir Nueva FAQ"}
                </h3>
              </div>
              <div className="companySettings-dialog-body">
                <div className="companySettings-form-group">
                  <label htmlFor="question">Pregunta</label>
                  <input
                    id="question"
                    className="companySettings-input"
                    value={currentFaq?.question || ""}
                    onChange={(e) => setCurrentFaq((prev) => (prev ? { ...prev, question: e.target.value } : null))}
                  />
                </div>
                <div className="companySettings-form-group">
                  <label htmlFor="answer">Respuesta</label>
                  <textarea
                    id="answer"
                    className="companySettings-textarea"
                    value={currentFaq?.answer || ""}
                    onChange={(e) => setCurrentFaq((prev) => (prev ? { ...prev, answer: e.target.value } : null))}
                    rows={4}
                  />
                </div>
              </div>
              <div className="companySettings-dialog-footer">
                <button className="companySettings-button-outline" onClick={() => setIsDialogOpen(false)}>
                  <XCircle className="companySettings-button-icon" />
                  Cancelar
                </button>
                <button onClick={handleSaveFaq} className="companySettings-button-primary" disabled={isSaving}>
                  <Save className="companySettings-button-icon" />
                  {isSaving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { HelpCircle, Plus, Edit, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react"

const FaqSettings = ({ faqs, loading, error, addFaq, updateFaq, deleteFaq, companyId }) => {
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" })
  const [expandedFaqs, setExpandedFaqs] = useState({})
  const [editingFaqId, setEditingFaqId] = useState(null)

  const handleAddFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return

    await addFaq({
      company_id: companyId,
      question: newFaq.question,
      answer: newFaq.answer,
    })

    setNewFaq({ question: "", answer: "" })
  }

  const handleUpdateFaq = (id, field, value) => {
    const updatedFaq = faqs.find((faq) => faq.faq_id === id)
    if (!updatedFaq) return

    updateFaq(id, {
      ...updatedFaq,
      [field]: value,
    })
  }

  const toggleFaqExpand = (id) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleEditFaq = (id) => {
    setEditingFaqId(id === editingFaqId ? null : id)
  }

  if (loading) {
    return <div className="companySettings-loading">Cargando preguntas frecuentes...</div>
  }

  if (error) {
    return <div className="companySettings-error">Error: {error}</div>
  }

  return (
    <div className="companySettings-card">
      <div className="companySettings-card-header">
        <h2>Preguntas Frecuentes</h2>
        <p>Administra las FAQ que verán tus usuarios</p>
      </div>
      <div className="companySettings-card-content">
        <div className="companySettings-faq-list">
          {faqs.map((faq) => (
            <div key={faq.faq_id} className="companySettings-faq-item">
              <div className="companySettings-faq-header">
                <div className="companySettings-faq-question" onClick={() => toggleFaqExpand(faq.faq_id)}>
                  <HelpCircle className="companySettings-faq-icon" />
                  {editingFaqId === faq.faq_id ? (
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(faq.faq_id, "question", e.target.value)}
                      className="companySettings-faq-edit-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h3>{faq.question}</h3>
                  )}
                  {expandedFaqs[faq.faq_id] ? (
                    <ChevronUp className="companySettings-faq-toggle" />
                  ) : (
                    <ChevronDown className="companySettings-faq-toggle" />
                  )}
                </div>
                <div className="companySettings-faq-actions">
                  <button className="companySettings-icon-button-small" onClick={() => handleEditFaq(faq.faq_id)}>
                    {editingFaqId === faq.faq_id ? (
                      <Save className="companySettings-icon-small" />
                    ) : (
                      <Edit className="companySettings-icon-small" />
                    )}
                  </button>
                  <button className="companySettings-icon-button-small" onClick={() => deleteFaq(faq.faq_id)}>
                    <Trash2 className="companySettings-icon-small" />
                  </button>
                </div>
              </div>
              {(expandedFaqs[faq.faq_id] || editingFaqId === faq.faq_id) && (
                <div className="companySettings-faq-answer">
                  {editingFaqId === faq.faq_id ? (
                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(faq.faq_id, "answer", e.target.value)}
                      className="companySettings-faq-edit-textarea"
                    ></textarea>
                  ) : (
                    <p>{faq.answer}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="companySettings-faq-form">
          <h3 className="companySettings-subtitle">Agregar Nueva Pregunta Frecuente</h3>
          <div className="companySettings-form-group">
            <label>Pregunta</label>
            <input
              type="text"
              className="companySettings-input"
              placeholder="Escriba la pregunta"
              value={newFaq.question}
              onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            />
          </div>
          <div className="companySettings-form-group">
            <label>Respuesta</label>
            <textarea
              className="companySettings-textarea"
              rows="3"
              placeholder="Escriba la respuesta"
              value={newFaq.answer}
              onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            ></textarea>
          </div>
          <div className="companySettings-form-actions">
            <button
              type="button"
              className="companySettings-button-full"
              onClick={handleAddFaq}
              disabled={!newFaq.question || !newFaq.answer}
            >
              <Plus className="companySettings-button-icon" />
              Agregar Pregunta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaqSettings


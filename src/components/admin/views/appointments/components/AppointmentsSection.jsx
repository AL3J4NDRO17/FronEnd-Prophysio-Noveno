"use client"

import { useState } from "react"
import { useCitas } from "../hooks/use-appointment"
import AppointmentItem from "./AppointmentItem"
import AppointmentFormModal from "./AppointmentFormModal"
import CancelPostponeModal from "./CancelPostponeModal"
import "../styles/AppointmentsSection.css" // CSS específico

const AppointmentsSection = () => {
  const { citas, loading, error, crearCita, actualizarCita, eliminarCita, postergarCita, cancelarCita, cargarCitas } =
    useCitas()
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [cancelMode, setCancelMode] = useState("cancel") // 'cancel' or 'postpone'

  const handleOpenFormModal = (cita = null) => {
    setSelectedAppointment(cita)
    setIsFormModalOpen(true)
  }

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleOpenCancelModal = (cita, mode) => {
    setSelectedAppointment(cita)
    setCancelMode(mode)
    setIsCancelModalOpen(true)
  }

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleSaveAppointment = async (formData) => {
    if (selectedAppointment) {
      await actualizarCita(selectedAppointment.id_cita, formData)
    } else {
      await crearCita(formData)
    }
    handleCloseFormModal()
  }

  const handleConfirmCancelPostpone = async (details) => {
    if (cancelMode === "cancel") {
      await cancelarCita(selectedAppointment.id_cita, details.motivo)
    } else if (cancelMode === "postpone") {
      await postergarCita(selectedAppointment.id_cita, details.motivo, details.nuevaFecha)
    }
    handleCloseCancelModal()
  }

  if (loading && citas.length === 0) return <div className="AppointmentsSection-loading">Cargando citas...</div>
  if (error)
    return (
      <div className="AppointmentsSection-error">
        Error al cargar citas: {error} <button onClick={cargarCitas}>Reintentar</button>
      </div>
    )

  return (
    <div className="AppointmentsSection-container">
      <div className="AppointmentsSection-header">
        <h2>Lista de Citas</h2>
        <button onClick={() => handleOpenFormModal()} className="AppointmentsSection-addButton">
          Agendar Nueva Cita
        </button>
      </div>

      {/* Aquí podrías agregar filtros por fecha, estado, paciente, etc. */}
      {/* <div className="AppointmentsSection-filters"> ... </div> */}

      {citas.length === 0 && !loading ? (
        <p className="AppointmentsSection-noAppointments">No hay citas programadas.</p>
      ) : (
        <ul className="AppointmentsSection-list">
          {citas.map((cita) => (
            <AppointmentItem
              key={cita.id_cita}
              cita={cita}
              onEdit={() => handleOpenFormModal(cita)}
              onDelete={() => eliminarCita(cita.id_cita)}
              onCancel={() => handleOpenCancelModal(cita, "cancel")}
              onPostpone={() => handleOpenCancelModal(cita, "postpone")}
            />
          ))}
        </ul>
      )}

      {isFormModalOpen && (
        <AppointmentFormModal
          isOpen={isFormModalOpen}
          onClose={handleCloseFormModal}
          onSave={handleSaveAppointment}
          initialData={selectedAppointment}
        />
      )}

      {isCancelModalOpen && selectedAppointment && (
        <CancelPostponeModal
          isOpen={isCancelModalOpen}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancelPostpone}
          appointmentDate={selectedAppointment.fecha_cita}
          mode={cancelMode} // 'cancel' o 'postpone'
        />
      )}
    </div>
  )
}

export default AppointmentsSection

"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, List, Settings, Plus, Search } from "lucide-react"
import { useCitas } from "./hooks/useCitas"
import { horarioService } from "./services/horarioService"
import { userService } from "./services/userService"
import { Button } from "@button"

import { Input } from "../../../public_ui/input"
import { toast } from "react-toastify"

import AppointmentCalendarView from "./components/AppointmentCalendarView"
import CalendarSidebar from "./components/CalendarSidebar"
import NewAppointmentModal from "./components/NewAppointmentModel"
import WorkHoursModal from "./components/WorksHourModal"
import AppointmentDetailsPanel from "./components/AppointmentDetailsPanel"
import CancelPostponeModal from "./components/CancelPostponeModal"

import "./appointments.css"
import "./styles/AppointmentCalendarView.css"
import "./styles/AppointmentFormModal.css"
import "./styles/AppointmentPopover.css"
import "./styles/AppointmentDetailsPanel.css"
import "./styles/reactBigCalendar.css"
import "./styles/CancelPostponeModal.css"

const AppointmentsAdmin = () => {
  const { citas, loading, error, fetchCitas, addCita, updateCita, deleteCita, cancelCita, postponeCita } = useCitas()
  const [viewMode, setViewMode] = useState("calendar") // 'calendar' o 'list'
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false)
  const [isWorkHoursModalOpen, setIsWorkHoursModalOpen] = useState(false)
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)
  const [selectedAppointmentForDetails, setSelectedAppointmentForDetails] = useState(null)
  const [isCancelPostponeModalOpen, setIsCancelPostponeModalOpen] = useState(false)
  const [cancelPostponeMode, setCancelPostponeMode] = useState("cancel") // 'cancel' o 'postpone'
  const [appointmentToModify, setAppointmentToModify] = useState(null)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [initialSelectedUser, setInitialSelectedUser] = useState(null)
  const [clinicWorkHours, setClinicWorkHours] = useState([])
  const [isSavingAppointment, setIsSavingAppointment] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const ENGLISH_DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const SPANISH_DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

  const fetchClinicHours = useCallback(async () => {
    try {
      const hours = await horarioService.getHorariosClinica()
      setClinicWorkHours(hours)
    } catch (err) {
      console.error("Error fetching clinic hours:", err)
      toast.error("Error al cargar los horarios de la clínica.")
    }
  }, [])

  useEffect(() => {
    fetchClinicHours()
  }, [fetchClinicHours])

  const handleSaveWorkHours = async (updatedHours) => {
    try {
      const hoursToSend = updatedHours.map((h) => ({
        ...h,
        dia:
          SPANISH_DAYS_OF_WEEK.indexOf(h.dia) !== -1
            ? ENGLISH_DAYS_OF_WEEK[SPANISH_DAYS_OF_WEEK.indexOf(h.dia)]
            : h.dia,
      }))
      await horarioService.updateClinicHours(hoursToSend)
      fetchClinicHours()
      setIsWorkHoursModalOpen(false)
    } catch (error) {
      console.error("Error saving work hours:", error)
      toast.error("Error al guardar los horarios de trabajo.")
    }
  }

  const handleOpenNewAppointmentModal = (user = null) => {
    setEditingAppointment(null)
    setInitialSelectedUser(user)
    setIsNewAppointmentModalOpen(true)
  }

  const handleOpenEditAppointmentModal = (appointment) => {
    setEditingAppointment(appointment)
    setIsNewAppointmentModalOpen(true)
  }

  const handleSaveAppointment = async (appointmentData, isEditing) => {
    setIsSavingAppointment(true)
    try {
      if (isEditing) {
        await updateCita(editingAppointment.id_cita, appointmentData)
      } else {
        await addCita(appointmentData)
      }
      setIsNewAppointmentModalOpen(false)
      setEditingAppointment(null)
      setInitialSelectedUser(null)
    } catch (err) {
      console.error("Error saving appointment:", err)
    } finally {
      setIsSavingAppointment(false)
    }
  }

  const handleOpenCancelPostponeModal = (appointment, mode) => {
    setAppointmentToModify(appointment)
    setCancelPostponeMode(mode)
    setIsCancelPostponeModalOpen(true)
  }

  const handleConfirmCancelPostpone = async (reason, newDateTime = null) => {
    try {
      if (cancelPostponeMode === "cancel") {
        await cancelCita(appointmentToModify.id_cita, reason)
      } else if (cancelPostponeMode === "postpone" && newDateTime) {
        await postponeCita(appointmentToModify.id_cita, newDateTime, reason)
      }
      setIsCancelPostponeModalOpen(false)
      setAppointmentToModify(null)
    } catch (err) {
      console.error("Error modifying appointment:", err)
    }
  }

  const handleOpenDetailsPanel = (appointment) => {
    setSelectedAppointmentForDetails(appointment)
    setIsDetailsPanelOpen(true)
  }

  const handleCloseDetailsPanel = () => {
    setIsDetailsPanelOpen(false)
    setSelectedAppointmentForDetails(null)
  }

  const filteredCitas = citas.filter((cita) => {
    const patientName = cita.usuario?.nombre?.toLowerCase() || ""
    const patientEmail = cita.usuario?.email?.toLowerCase() || ""
    const notes = cita.notes?.toLowerCase() || ""
    const term = searchTerm.toLowerCase()
    return patientName.includes(term) || patientEmail.includes(term) || notes.includes(term)
  })

  if (loading) return <div className="appointments-loading-message">Cargando citas...</div>
  if (error) return <div className="appointments-error-message">Error: {error.message}</div>

  return (
    <div className="appointments-page-container">
      <div className="appointments-page-header">
        <h1 className="appointments-page-title">Gestión de Citas</h1>
        <div className="appointments-page-actions">
          <div className="appointments-search-bar">
            <Search className="appointments-search-icon" />
            <Input
              placeholder="Buscar citas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="appointments-search-input"
            />
          </div>
          <Button onClick={() => handleOpenNewAppointmentModal()} className="appointments-add-button">
            <Plus className="icon-small-margin-right" />
            Nueva Cita
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsWorkHoursModalOpen(true)}
            className="appointments-settings-button"
          >
            <Settings className="icon-small" />
            <span className="sr-only">Ajustar Horario</span>
          </Button>
          
        </div>
      </div>

      <div className="appointments-content-wrapper">
        {viewMode === "calendar" ? (
          <AppointmentCalendarView
            events={filteredCitas}
            onSelectEvent={handleOpenDetailsPanel}
            onSelectSlot={handleOpenNewAppointmentModal}
            clinicWorkHours={clinicWorkHours}
          />
        ) : (
          <CalendarSidebar
            appointments={filteredCitas}
            onEditAppointment={handleOpenEditAppointmentModal}
            onCancelPostpone={handleOpenCancelPostponeModal}
            onViewDetails={handleOpenDetailsPanel}
            onScheduleAppointment={handleOpenNewAppointmentModal}
          />
        )}
      </div>

      <NewAppointmentModal
        isOpen={isNewAppointmentModalOpen}
        onClose={() => setIsNewAppointmentModalOpen(false)}
        onSave={handleSaveAppointment}
        editingAppointment={editingAppointment}
        initialSelectedUser={initialSelectedUser}
        clinicWorkHours={clinicWorkHours}
        allAppointments={citas}
        userService={userService}
        isSaving={isSavingAppointment}
      />

      <WorkHoursModal
        isOpen={isWorkHoursModalOpen}
        onClose={() => setIsWorkHoursModalOpen(false)}
        currentWorkHours={clinicWorkHours}
        onSave={handleSaveWorkHours}
      />

      <AppointmentDetailsPanel
        isOpen={isDetailsPanelOpen}
        onClose={handleCloseDetailsPanel}
        appointment={selectedAppointmentForDetails}
        onScheduleAppointment={handleOpenNewAppointmentModal}
      />

      <CancelPostponeModal
        isOpen={isCancelPostponeModalOpen}
        onClose={() => setIsCancelPostponeModalOpen(false)}
        mode={cancelPostponeMode}
        appointment={appointmentToModify}
        onConfirm={handleConfirmCancelPostpone}
        clinicWorkHours={clinicWorkHours}
        allAppointments={citas}
      />
    </div>
  )
}

export default AppointmentsAdmin

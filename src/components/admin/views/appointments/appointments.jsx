"use client"

import { SelectContent,SelectTrigger,SelectValue } from "../../../public_ui/select"


import { useState, useEffect } from "react"
import { Search, Plus, ChevronLeft, ChevronRight, SettingsIcon, Filter } from "lucide-react" // Añadido Filter
import "./appointments.css"
import { useCitas } from "./hooks/use-appointment.js"
import AppointmentItemRow from "./components/AppointmentItemRow"
import CancelPostponeModal from "./components/CancelPostponeModal"
import WorkHoursModal from "./components/WorksHourModal"
import AppointmentDetailsPanel from "./components/AppointmentDetailsPanel" // Nuevo componente
import { Button } from "../../../public_ui/button"
import { Input } from "../../../public_ui/input"
import { Label } from "../../../public_ui/label"
import { Select, SelectItem } from "../../../public_ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../../../public_ui/card"
import { toast } from "react-toastify"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs/tabs.jsx" // Importar Tabs desde shadcn
// Helper to get initials
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

// Default work hours (example)
const DEFAULT_WORK_HOURS = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // 0 (Sun) to 6 (Sat)
  startTime: "09:00",
  endTime: "18:00",
}


// Helper to get initials

// Default work hours (example)


function AppointmentsPage() {
  const { citas, loading, error, crearCita, actualizarCita, eliminarCita, postergarCita, cancelarCita, cargarCitas } =
    useCitas()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [appointmentToCancelOrPostpone, setAppointmentToCancelOrPostpone] = useState(null)
  const [cancelPostponeMode, setCancelPostponeMode] = useState("cancel") // 'cancel' or 'postpone'
  const [showCancelPostponeModal, setShowCancelPostponeModal] = useState(false)
  const [showWorkHoursModal, setShowWorkHoursModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // Nuevo estado para el filtro de estado
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState(null) // Estado para el panel de detalles
  const [showDetailsPanel, setShowDetailsPanel] = useState(false) // Estado para mostrar/ocultar el panel
  const [filterCategory, setFilterCategory] = useState("upcoming") // 'upcoming', 'cancelled', 'completed'

  const [workHours, setWorkHours] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("prophysioWorkHours")
      return saved ? JSON.parse(saved) : DEFAULT_WORK_HOURS
    }
    return DEFAULT_WORK_HOURS
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("prophysioWorkHours", JSON.stringify(workHours))
    }
  }, [workHours])

  const [newAppointmentData, setNewAppointmentData] = useState({
    nombre_paciente: "",
    fecha_hora: new Date().toISOString().split("T")[0], // Cambiado a fecha_hora
    hora_cita: "09:00",
    estado: "pendiente",
    notas: "",
    numero_sesion: 1,
    id_paciente: "", // Nuevo campo para el ID del paciente
  })

  const formatDateForDisplay = (date) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate)
  }

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const handleNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const openNewAppointmentModal = (appointment = null) => {
    if (appointment) {
      setEditingAppointment(appointment)
      const appDate = new Date(appointment.fecha_hora) // Cambiado a fecha_hora
      setNewAppointmentData({
        nombre_paciente: appointment.nombre || "",
        fecha_hora: appDate.toISOString().split("T")[0], // Cambiado a fecha_hora
        hora_cita: appDate.toTimeString().split(" ")[0].substring(0, 5),
        estado: appointment.estado || "pendiente",
        notas: appointment.notas || "",
        numero_sesion: appointment.numero_sesion || 1,
        id_paciente: appointment.id_usuario|| "", // Mantener el ID del paciente
      })
    } else {
      setEditingAppointment(null)
      const today = new Date()
      let defaultHour = workHours.startTime
      if (
        today.toISOString().split("T")[0] === new Date().toISOString().split("T")[0] &&
        today.toTimeString().split(" ")[0].substring(0, 5) > defaultHour
      ) {
        const currentMinutes = today.getHours() * 60 + today.getMinutes()
        const startMinutes =
          Number.parseInt(workHours.startTime.split(":")[0]) * 60 + Number.parseInt(workHours.startTime.split(":")[1])
        if (currentMinutes > startMinutes) {
          let nextHour = today.getHours()
          const nextMinutes = today.getMinutes() < 30 ? 30 : 0
          if (nextMinutes === 0) nextHour++
          if (nextHour < 24) {
            defaultHour = `${String(nextHour).padStart(2, "0")}:${String(nextMinutes).padStart(2, "0")}`
          }
        }
      }

      setNewAppointmentData({
        nombre_paciente: "",
        fecha_hora: today.toISOString().split("T")[0], // Cambiado a fecha_hora
        hora_cita: defaultHour,
        estado: "pendiente",
        notas: "",
        numero_sesion: 1, // Se calculará en handleSaveAppointment
        id_paciente: "", // Se generará o asignará en handleSaveAppointment
      })
    }
    setShowNewAppointmentModal(true)
  }

  const handleModalInputChange = (e) => {
    const { name, value } = e.target
    setNewAppointmentData((prev) => ({ ...prev, [name]: value }))
  }

  const isTimeSlotAvailable = (dateTime, duration, existingAppointments, editingAppId = null) => {
    const newAppStartTime = new Date(dateTime).getTime()
    const newAppEndTime = newAppStartTime + Number.parseInt(duration) * 60 * 1000

    const selectedDay = new Date(dateTime).getDay()
    const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][selectedDay]

    if (!workHours.days.includes(dayName)) {
      toast.error(`La clínica no trabaja los ${dayName}s.`)
      return false
    }

    const workStartTimeParts = workHours.startTime.split(":")
    const workEndTimeParts = workHours.endTime.split(":")

    const workStartDateTime = new Date(dateTime)
    workStartDateTime.setHours(Number.parseInt(workStartTimeParts[0]), Number.parseInt(workStartTimeParts[1]), 0, 0)

    const workEndDateTime = new Date(dateTime)
    workEndDateTime.setHours(Number.parseInt(workEndTimeParts[0]), Number.parseInt(workEndTimeParts[1]), 0, 0)

    if (newAppStartTime < workStartDateTime.getTime() || newAppEndTime > workEndDateTime.getTime()) {
      toast.error(
        `El horario seleccionado está fuera del horario laboral (${workHours.startTime} - ${workHours.endTime}).`,
      )
      return false
    }

    for (const app of existingAppointments) {
      if (editingAppId && app.id_cita === editingAppId) continue

      const existingAppStartTime = new Date(app.fecha_hora).getTime() // Cambiado a fecha_hora
      const existingAppEndTime = existingAppStartTime + (app.duracion || 30) * 60 * 1000

      if (newAppStartTime < existingAppEndTime && newAppEndTime > existingAppStartTime) {
        toast.error("El horario seleccionado se superpone con otra cita.")
        return false
      }
    }
    return true
  }

  const handleSaveAppointment = async () => {
    const { fecha_hora, hora_cita, nombre_paciente, ...restData } = newAppointmentData // Cambiado a fecha_hora
    const combinedDateTime = `${fecha_hora}T${hora_cita}:00` // Cambiado a fecha_hora
    const DEFAULT_DURATION = 30 // Duración por defecto en minutos

    if (!isTimeSlotAvailable(combinedDateTime, DEFAULT_DURATION, citas, editingAppointment?.id_cita)) {
      return
    }

    let nextSessionNumber = restData.numero_sesion
    let patientId = restData.id_paciente

    if (!editingAppointment) {
      // Lógica para nuevas citas: calcular numero_sesion y generar id_paciente si es nuevo
      const patientCompletedAppointments = citas.filter(
        (cita) => cita.nombre === nombre_paciente && cita.estado === "completada",
      )
      nextSessionNumber = patientCompletedAppointments.length + 1

      // Generar un id_paciente simple si no existe (para la demo)
      // En un sistema real, esto vendría de una base de datos de pacientes
      if (!patientId) {
        const existingPatient = citas.find((c) => c.nombre === nombre_paciente)
        patientId = existingPatient ? existingPatient.id_usuario: `paciente_${Date.now()}`
      }
    }

    const appointmentPayload = {
      ...restData,
      fecha_hora: new Date(combinedDateTime).toISOString(), // Cambiado a fecha_hora
      duracion: DEFAULT_DURATION, // Usar la duración por defecto
      numero_sesion: nextSessionNumber,
      id_paciente: patientId,
    }

    try {
      if (editingAppointment) {
        await actualizarCita(editingAppointment.id_cita, appointmentPayload)
      } else {
        await crearCita(appointmentPayload)
      }
      setShowNewAppointmentModal(false)
      setEditingAppointment(null)
    } catch (err) {
      // Error toast is handled by useCitas
    }
  }

  const openCancelPostponeModal = (appointment, mode) => {
    setAppointmentToCancelOrPostpone(appointment)
    setCancelPostponeMode(mode)
    setShowCancelPostponeModal(true)
  }

  const handleConfirmCancelPostpone = async (details) => {
    if (!appointmentToCancelOrPostpone) return

    try {
      if (cancelPostponeMode === "cancel") {
        await cancelarCita(appointmentToCancelOrPostpone.id_cita, details.motivo)
      } else if (cancelPostponeMode === "postpone") {
        const newCombinedDateTime = details.nuevaFecha
        const appointmentDuration = appointmentToCancelOrPostpone.duracion || 30

        if (
          !isTimeSlotAvailable(newCombinedDateTime, appointmentDuration, citas, appointmentToCancelOrPostpone.id_cita)
        ) {
          return
        }
        await postergarCita(appointmentToCancelOrPostpone.id_cita, details.motivo, details.nuevaFecha)
      }
      setShowCancelPostponeModal(false)
      setAppointmentToCancelOrPostpone(null)
    } catch (err) {
      // Error toast handled by useCitas
    }
  }

  const handleViewDetails = (appointment) => {
    setSelectedAppointmentDetails(appointment)
    setShowDetailsPanel(true)
  }

  const renderCalendar = () => {
    const monthDate = new Date(currentDate)
    const currentMonth = monthDate.getMonth()
    const currentYear = monthDate.getFullYear()

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

    const daysInMonth = lastDayOfMonth.getDate()
    const startDayOfWeek = firstDayOfMonth.getDay()

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    const dayNames = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]

    const days = []
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="appointmentsAdmin-calendar-day empty"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentYear, currentMonth, day)
      const isSelectedDay =
        day === currentDate.getDate() &&
        currentMonth === currentDate.getMonth() &&
        currentYear === currentDate.getFullYear()

      const dayNameOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
        dayDate.getDay()
      ]
      const isWorkingDay = workHours.days.includes(dayNameOfWeek)

      days.push(
        <div
          key={`day-${day}`}
          className={`appointmentsAdmin-calendar-day ${isSelectedDay ? "current" : ""} ${!isWorkingDay ? "disabled-day" : ""}`}
          onClick={() => {
            if (isWorkingDay) {
              handleDateChange(dayDate)
            } else {
              toast.info(`El día seleccionado (${dayNames[dayDate.getDay()]}) no es un día laboral.`)
            }
          }}
          title={!isWorkingDay ? "Día no laboral" : ""}
        >
          {day}
        </div>,
      )
    }

    const navigateMonth = (offset) => {
      const newMonthDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + offset, 1)
      setCurrentDate(newMonthDate)
    }

    return (
      <div className="appointmentsAdmin-calendar">
        <div className="appointmentsAdmin-calendar-header">
          <button className="appointmentsAdmin-calendar-nav-btn" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="appointmentsAdmin-icon-sm" />
          </button>
          <div className="appointmentsAdmin-calendar-title">
            {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
          </div>
          <button className="appointmentsAdmin-calendar-nav-btn" onClick={() => navigateMonth(1)}>
            <ChevronRight className="appointmentsAdmin-icon-sm" />
          </button>
        </div>
        <div className="appointmentsAdmin-calendar-days-header">
          {dayNames.map((day) => (
            <div key={day} className="appointmentsAdmin-calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="appointmentsAdmin-calendar-days-grid">{days}</div>
      </div>
    )
  }

  // Filter and sort all appointments
  const filteredAndSortedAppointments = citas
    .filter((cita) => {
      const matchesSearch =
        searchTerm === "" ||
        cita.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.numero_sesion?.toString().includes(searchTerm)

      const matchesStatus = filterStatus === "all" || cita.estado?.toLowerCase() === filterStatus.toLowerCase()

      let matchesCategory = true
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Normalizar a inicio del día

      const citaDate = new Date(cita.fecha_hora) // Usar fecha_hora
      citaDate.setHours(0, 0, 0, 0) // Normalizar a inicio del día

      if (filterCategory === "upcoming") {
        matchesCategory =
          (cita.estado === "pendiente" || cita.estado === "confirmada" || cita.estado === "postergada") &&
          citaDate >= today
      } else if (filterCategory === "cancelled") {
        matchesCategory = cita.estado === "cancelada"
      } else if (filterCategory === "completed") {
        matchesCategory = cita.estado === "completada"
      }

      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      const dateA = new Date(a.fecha_hora) // Cambiado a fecha_hora
      const dateB = new Date(b.fecha_hora) // Cambiado a fecha_hora

      if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
      if (isNaN(dateA.getTime())) return 1
      if (isNaN(dateB.getTime())) return -1

      // Para "upcoming", ordenar de más cercana a más lejana
      if (filterCategory === "upcoming") {
        return dateA.getTime() - dateB.getTime()
      }
      // Para "cancelled" y "completed", ordenar de más reciente a más antigua
      return dateB.getTime() - dateA.getTime()
    })

  // Time slots for the "Nueva Cita" modal, based on work hours
  const getTimeSlots = () => {
    const slots = []
    if (!workHours.startTime || !workHours.endTime) return slots

    const [startH, startM] = workHours.startTime.split(":").map(Number)
    const [endH, endM] = workHours.endTime.split(":").map(Number)
    const interval = 15 // 15 minute intervals

    let currentHour = startH
    let currentMinute = startM

    while (currentHour < endH || (currentHour === endH && currentMinute <= endM)) {
      slots.push(`${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`)
      currentMinute += interval
      if (currentMinute >= 60) {
        currentHour++
        currentMinute %= 60
      }
    }
    if (slots.length > 0) {
      const lastSlot = slots[slots.length - 1]
      const [lastH, lastMin] = lastSlot.split(":").map(Number)
      if (lastH > endH || (lastH === endH && lastMin > endM)) {
        slots.pop()
      }
    }
    return slots
  }
  const timeSlots = getTimeSlots()

  return (
    <div className="appointmentsAdmin-container">
    
      {/* Header */}
      <header className="appointmentsAdmin-header">
        <div className="appointmentsAdmin-header-title">
          <h1>Gestión de Citas</h1>
        </div>
        <div className="appointmentsAdmin-header-actions">
          <div className="appointmentsAdmin-search-container">
            <Search className="appointmentsAdmin-search-icon" />
            <Input
              type="text"
              placeholder="Buscar citas..."
              className="appointmentsAdmin-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-mr" />
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="confirmada">Confirmada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
              <SelectItem value="postergada">Postergada</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowWorkHoursModal(true)}
            className="appointmentsAdmin-btn-icon"
            title="Ajustar Horario Laboral"
          >
            <SettingsIcon className="appointmentsAdmin-icon-sm" />
          </Button>
          <Button variant="primary" onClick={() => openNewAppointmentModal()}>
            <Plus className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-mr" />
            Nueva cita
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="appointmentsAdmin-content">
        {/* Calendar sidebar */}
        <div className="appointmentsAdmin-sidebar">
          <div className="appointmentsAdmin-sidebar-calendar">{renderCalendar()}</div>
          /
          
        </div>

        {/* Main content */}
        <main className="appointmentsAdmin-main">
          <div className="appointmentsAdmin-date-navigation">
            <div className="appointmentsAdmin-date-controls">
              <Button variant="outline" size="sm" onClick={handlePreviousDay}>
                <ChevronLeft className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-mr" />
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Hoy
              </Button>
              <div className="appointmentsAdmin-current-date">{formatDateForDisplay(currentDate)}</div>
              <Button variant="outline" size="sm" onClick={handleNextDay}>
                Siguiente
                <ChevronRight className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-ml" />
              </Button>
            </div>
          </div>

          {/* NUEVA POSICIÓN PARA LOS FILTROS HORIZONTALES */}
          <Tabs value={filterCategory} onValueChange={setFilterCategory} className="mb-4">
            <TabsList>
              <TabsTrigger value="upcoming">Próximas</TabsTrigger>
              <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
              <TabsTrigger value="completed">Finalizadas</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Todas las Citas</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && <p>Cargando citas...</p>}
              {error && <p>Error al cargar citas: {error.message || error}</p>}
              {!loading && !error && filteredAndSortedAppointments.length === 0 && (
                <p>No hay citas programadas que coincidan con los filtros.</p>
              )}
              {!loading && !error && filteredAndSortedAppointments.length > 0 && (
                <table className="appointmentsAdmin-table">
                  <thead>
                    <tr>
                      <th className="appointmentsAdmin-th appointmentsAdmin-th-time">Hora</th>
                      <th className="appointmentsAdmin-th">Paciente</th>
                      <th className="appointmentsAdmin-th">Sesión</th>
                      <th className="appointmentsAdmin-th">Duración</th>
                      <th className="appointmentsAdmin-th">Estado</th>
                      <th className="appointmentsAdmin-th appointmentsAdmin-th-actions">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedAppointments.map((cita) => (
                      <AppointmentItemRow
                        key={cita.id_cita}
                        cita={cita}
                        onEdit={() => openNewAppointmentModal(cita)}
                        onDelete={() => eliminarCita(cita.id_cita)}
                        onCancel={() => openCancelPostponeModal(cita, "cancel")}
                        onPostpone={() => openCancelPostponeModal(cita, "postpone")}
                        onViewPatientHistory={() => handleViewDetails(cita)} // Nuevo prop
                        getInitials={getInitials}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* New/Edit Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="appointmentsAdmin-modal-overlay">
          <div className="appointmentsAdmin-modal">
            <div className="appointmentsAdmin-modal-header">
              <h2 className="appointmentsAdmin-modal-title">
                {editingAppointment ? "Editar Cita" : "Programar Nueva Cita"}
              </h2>
              <p className="appointmentsAdmin-modal-description">
                Complete los detalles para {editingAppointment ? "actualizar la" : "agendar una nueva"} cita.
              </p>
            </div>
            <div className="appointmentsAdmin-modal-content">
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="nombre_paciente_modal">Paciente</Label>
                <Input
                  id="nombre_paciente_modal"
                  name="nombre_paciente"
                  value={newAppointmentData.nombre}
                  onChange={handleModalInputChange}
                  placeholder="Nombre completo del paciente"
                  required
                />
              </div>
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="fecha_hora_modal">Fecha</Label> {/* Cambiado a fecha_hora_modal */}
                <div className="appointmentsAdmin-date-picker">
                  <Input
                    type="date"
                    id="fecha_hora_modal" // Cambiado a fecha_hora_modal
                    name="fecha_hora" // Cambiado a fecha_hora
                    value={newAppointmentData.fecha_hora} // Cambiado a fecha_hora
                    onChange={handleModalInputChange}
                    required
                  />
                </div>
              </div>
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="hora_cita_modal">Hora</Label>
                <Select
                  id="hora_cita_modal"
                  name="hora_cita"
                  value={newAppointmentData.hora_cita}
                  onChange={handleModalInputChange}
                  required
                >
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="numero_sesion_modal">Número de Sesión</Label>
                <Input
                  type="number"
                  id="numero_sesion_modal"
                  name="numero_sesion"
                  value={newAppointmentData.numero_sesion}
                  onChange={handleModalInputChange}
                  min="1"
                />
              </div>
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="estado_modal">Estado</Label>
                <Select
                  id="estado_modal"
                  name="estado"
                  value={newAppointmentData.estado}
                  onChange={handleModalInputChange}
                >
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                </Select>
              </div>
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="notas_modal">Notas</Label>
                <textarea
                  id="notas_modal"
                  name="notas"
                  value={newAppointmentData.notas}
                  onChange={handleModalInputChange}
                  className="appointmentsAdmin-form-textarea"
                  placeholder="Notas adicionales sobre la cita"
                ></textarea>
              </div>
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="id_paciente_modal">ID Paciente (Solo lectura)</Label>
                <Input
                  id="id_paciente_modal"
                  name="id_paciente"
                  value={newAppointmentData.id_usuario|| ""}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="appointmentsAdmin-modal-footer">
              <Button variant="outline" onClick={() => setShowNewAppointmentModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSaveAppointment} disabled={loading}>
                {loading ? "Guardando..." : editingAppointment ? "Actualizar Cita" : "Programar Cita"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel/Postpone Modal */}
      {showCancelPostponeModal && appointmentToCancelOrPostpone && (
        <CancelPostponeModal
          isOpen={showCancelPostponeModal}
          onClose={() => setShowCancelPostponeModal(false)}
          onConfirm={handleConfirmCancelPostpone}
          appointmentDate={appointmentToCancelOrPostpone.fecha_cita}
          mode={cancelPostponeMode}
          workHours={workHours}
        />
      )}

      {/* Work Hours Modal */}
      {showWorkHoursModal && (
        <WorkHoursModal
          isOpen={showWorkHoursModal}
          onClose={() => setShowWorkHoursModal(false)}
          currentWorkHours={workHours}
          onSave={(newHours) => {
            setWorkHours(newHours)
            setShowWorkHoursModal(false)
            toast.success("Horario laboral actualizado.")
          }}
        />
      )}

      {/* Appointment Details Panel */}
      {showDetailsPanel && selectedAppointmentDetails && (
        <AppointmentDetailsPanel
          isOpen={showDetailsPanel}
          onClose={() => setShowDetailsPanel(false)}
          appointment={selectedAppointmentDetails}
        />
      )}
    </div>
  )
}

export default AppointmentsPage


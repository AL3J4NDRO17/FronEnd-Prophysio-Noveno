"use client"

import { useState, useEffect, useCallback } from "react"
import { User } from "lucide-react"
import { Button } from "../../../../public_ui/button"
import { Input } from "../../../../public_ui/input"
import { Label } from "../../../../public_ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../public_ui/select"
import { Avatar, AvatarFallback } from "../../../../public_ui/avatar"
import { toast } from "react-toastify"
import { format, parseISO, setHours, setMinutes, addMinutes, isBefore, isEqual, isAfter, getDay } from "date-fns" // Importar funciones de date-fns
import "../styles/NewAppointmentModal.css"

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

// Días de la semana en inglés (getDay() de date-fns devuelve 0 para Domingo)
const ENGLISH_DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const SPANISH_DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const DEFAULT_SESSION_DURATION = 60 // Duración por defecto si no se encuentra en el horario

const NewAppointmentModal = ({
  isOpen,
  onClose,
  onSave,
  editingAppointment,
  initialSelectedUser,
  clinicWorkHours,
  allAppointments,
  userService,
  isSaving,
}) => {
  const [newAppointmentData, setNewAppointmentData] = useState({
    id_usuario: "",
    fecha_hora: format(new Date(), "yyyy-MM-dd"), // Usar date-fns para formato inicial
    hora_cita: "09:00",
    estado: "pendiente",
    notes: "",
    numero_sesion: 1,
  })
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [foundUsers, setFoundUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userSearchLoading, setUserSearchLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (editingAppointment) {
        const appDate = parseISO(editingAppointment.fecha_hora) // Usar parseISO
        setNewAppointmentData({
          id_usuario: editingAppointment.id_usuario || "",
          fecha_hora: format(appDate, "yyyy-MM-dd"), // Formatear a YYYY-MM-DD
          hora_cita: format(appDate, "HH:mm"), // Formatear a HH:mm
          estado: editingAppointment.estado || "pendiente",
          notes: editingAppointment.notes || "",
          numero_sesion: editingAppointment.numero_sesion || 1,
        })
        setSelectedUser({
          id_usuario: editingAppointment.id_usuario,
          nombre: editingAppointment.usuario?.nombre,
          email: editingAppointment.usuario?.email,
        })
        setUserSearchTerm(editingAppointment.usuario?.nombre || "")
      } else if (initialSelectedUser) {
        setNewAppointmentData((prev) => ({
          ...prev,
          id_usuario: initialSelectedUser.id_usuario,
        }))
        setSelectedUser(initialSelectedUser)
        setUserSearchTerm(initialSelectedUser.nombre)
      } else {
        const today = new Date()
        let defaultHour = "09:00"
        if (clinicWorkHours && clinicWorkHours.length > 0) {
          const todayDayNameEnglish = ENGLISH_DAYS_OF_WEEK[getDay(today)] // Usar getDay de date-fns
          const firstScheduleForToday = clinicWorkHours.find((s) => s.dia === todayDayNameEnglish)
          if (firstScheduleForToday) {
            defaultHour = firstScheduleForToday.hora_inicio.substring(0, 5)
          }
        }
        setNewAppointmentData({
          id_usuario: "",
          fecha_hora: format(today, "yyyy-MM-dd"), // Usar date-fns para formato
          hora_cita: defaultHour,
          estado: "pendiente",
          notes: "",
          numero_sesion: 1,
        })
        setSelectedUser(null)
        setFoundUsers([])
        setUserSearchTerm("")
      }
    }
  }, [isOpen, editingAppointment, initialSelectedUser, clinicWorkHours])

  const handleModalInputChange = (e) => {
    const { name, value } = e.target
    setNewAppointmentData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUserSearch = useCallback(
    async (term) => {
      setUserSearchTerm(term)
      if (term.length > 2) {
        setUserSearchLoading(true)
        try {
          const users = await userService.searchUsers(term)
          setFoundUsers(users)
        } catch (err) {
          console.error("Error searching users:", err)
          setFoundUsers([])
          toast.error("Error al buscar usuarios.")
        } finally {
          setUserSearchLoading(false)
        }
      } else {
        setFoundUsers([])
      }
    },
    [userService],
  )

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setNewAppointmentData((prev) => ({
      ...prev,
      id_usuario: user.id_usuario,
    }))
    setFoundUsers([])
    setUserSearchTerm(user.nombre)
  }

  const isTimeSlotAvailable = (dateTime, existingAppointments, editingAppId = null) => {
    const selectedDateTime = parseISO(dateTime) // Usar parseISO
    const selectedDayIndex = getDay(selectedDateTime) // Usar getDay de date-fns
    const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[selectedDayIndex]

    console.log(
      "NewAppointmentModal - isTimeSlotAvailable - Fecha y Hora seleccionada:",
      selectedDateTime.toISOString(),
    )
    console.log("NewAppointmentModal - isTimeSlotAvailable - Índice del día:", selectedDayIndex)
    console.log("NewAppointmentModal - isTimeSlotAvailable - Nombre del día (inglés):", selectedDayNameEnglish)

    const daySchedules = clinicWorkHours.filter((schedule) => schedule.dia === selectedDayNameEnglish)
    console.log("NewAppointmentModal - isTimeSlotAvailable - Horarios de clínica para el día:", daySchedules)

    if (daySchedules.length === 0) {
      toast.error(`La clínica no trabaja los ${SPANISH_DAYS_OF_WEEK[selectedDayIndex]}s.`)
      return false
    }

    let isWithinWorkHours = false
    let sessionDuration = 0

    for (const schedule of daySchedules) {
      const [startH, startM] = schedule.hora_inicio.split(":").map(Number)
      const [endH, endM] = schedule.hora_fin.split(":").map(Number)

      const workStartDateTime = setMinutes(setHours(selectedDateTime, startH), startM) // Usar setHours, setMinutes
      const workEndDateTime = setMinutes(setHours(selectedDateTime, endH), endM) // Usar setHours, setMinutes

      if (
        (isEqual(selectedDateTime, workStartDateTime) || isAfter(selectedDateTime, workStartDateTime)) && // Usar isEqual, isAfter
        isBefore(selectedDateTime, workEndDateTime) // Usar isBefore
      ) {
        sessionDuration = schedule.duracion_sesion
        const newAppEndTime = addMinutes(selectedDateTime, sessionDuration) // Usar addMinutes
        if (isBefore(newAppEndTime, workEndDateTime) || isEqual(newAppEndTime, workEndDateTime)) {
          isWithinWorkHours = true
          break
        }
      }
    }

    if (!isWithinWorkHours) {
      toast.error(
        "El horario seleccionado está fuera del horario laboral de la clínica para este día o la duración excede el bloque.",
      )
      return false
    }

    const newAppEndTime = addMinutes(selectedDateTime, sessionDuration) // Usar addMinutes

    for (const app of existingAppointments) {
      if (editingAppId && app.id_cita === editingAppId) continue
      if (app.estado === "cancelada" || app.estado === "completada" || app.estado === "inasistencia") continue

      const existingAppStartTime = parseISO(app.fecha_hora) // Usar parseISO
      const existingAppDuration = app.duracion || DEFAULT_SESSION_DURATION
      const existingAppEndTime = addMinutes(existingAppStartTime, existingAppDuration) // Usar addMinutes

      if (isBefore(selectedDateTime, existingAppEndTime) && isAfter(newAppEndTime, existingAppStartTime)) {
        toast.error("El horario seleccionado se superpone con otra cita existente.")
        return false
      }
    }
    return true
  }

  const getTimeSlots = useCallback(() => {
    const slots = []
    if (!newAppointmentData.fecha_hora || !Array.isArray(clinicWorkHours) || clinicWorkHours.length === 0) return []

    const selectedDate = parseISO(newAppointmentData.fecha_hora) // Usar parseISO
    const dayOfWeekIndex = getDay(selectedDate) // Usar getDay de date-fns
    // ¡CORRECCIÓN CRÍTICA AQUÍ! clinicWorkHours ya tiene los días en inglés.
    const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[dayOfWeekIndex]

    console.log("NewAppointmentModal - getTimeSlots - Fecha seleccionada:", selectedDate.toISOString())
    console.log("NewAppointmentModal - getTimeSlots - Índice del día:", dayOfWeekIndex)
    console.log("NewAppointmentModal - getTimeSlots - Nombre del día (inglés):", selectedDayNameEnglish)
    console.log("NewAppointmentModal - getTimeSlots - clinicWorkHours (para filtrar):", clinicWorkHours)

    const daySchedules = clinicWorkHours.filter((schedule) => schedule.dia === selectedDayNameEnglish)
    console.log("NewAppointmentModal - getTimeSlots - Horarios encontrados para el día:", daySchedules)

    if (daySchedules.length === 0) return []

    const allPotentialSlots = []
    daySchedules.forEach((schedule) => {
      const [startH, startM] = schedule.hora_inicio.split(":").map(Number)
      const [endH, endM] = schedule.hora_fin.split(":").map(Number)
      const currentSessionDuration = schedule.duracion_sesion

      let current = setMinutes(setHours(selectedDate, startH), startM) // Usar setHours, setMinutes
      const end = setMinutes(setHours(selectedDate, endH), endM) // Usar setHours, setMinutes

      while (
        isBefore(addMinutes(current, currentSessionDuration), addMinutes(end, 1)) ||
        isEqual(addMinutes(current, currentSessionDuration), end)
      ) {
        // Ajuste para incluir el último slot si coincide exactamente
        allPotentialSlots.push(format(current, "HH:mm")) // Usar format
        current = addMinutes(current, currentSessionDuration) // Usar addMinutes
      }
    })

    const uniqueSortedPotentialSlots = [...new Set(allPotentialSlots)].sort()

    const filteredSlots = uniqueSortedPotentialSlots.filter((slot) => {
      const potentialAppStart = parseISO(`${newAppointmentData.fecha_hora}T${slot}:00`) // Usar parseISO
      let currentSlotDuration = 0

      const selectedDayNameEnglishForSlot = ENGLISH_DAYS_OF_WEEK[getDay(potentialAppStart)] // Usar getDay
      console.log(clinicWorkHours,"|",)
      const relevantSchedule = clinicWorkHours.find((s) => {
        const [sH, sM] = s.hora_inicio.split(":").map(Number)
        const [eH, eM] = s.hora_fin.split(":").map(Number)
        const scheduleStart = setMinutes(setHours(potentialAppStart, sH), sM) // Usar setHours, setMinutes
        const scheduleEnd = setMinutes(setHours(potentialAppStart, eH), eM) // Usar setHours, setMinutes

        return (
          s.dia === selectedDayNameEnglishForSlot &&
          (isEqual(potentialAppStart, scheduleStart) || isAfter(potentialAppStart, scheduleStart)) &&
          isBefore(potentialAppStart, scheduleEnd)
        )
      })

      if (relevantSchedule) {
        currentSlotDuration = relevantSchedule.duracion_sesion
      } else {
        currentSlotDuration = DEFAULT_SESSION_DURATION
      }

      const potentialAppEnd = addMinutes(potentialAppStart, currentSlotDuration) // Usar addMinutes

      const isOverlapping = allAppointments.some((existingApp) => {
        if (editingAppointment && existingApp.id_cita === editingAppointment.id_cita) return false
        if (
          existingApp.estado === "cancelada" ||
          existingApp.estado === "completada" ||
          existingApp.estado === "inasistencia"
        )
          return false

        const existingAppStartTime = parseISO(existingApp.fecha_hora) // Usar parseISO
        const existingAppDuration = existingApp.duracion || DEFAULT_SESSION_DURATION
        const existingAppEndTime = addMinutes(existingAppStartTime, existingAppDuration) // Usar addMinutes

        return isBefore(potentialAppStart, existingAppEndTime) && isAfter(potentialAppEnd, existingAppStartTime)
      })
      return !isOverlapping
    })
    return filteredSlots
  }, [newAppointmentData.fecha_hora, clinicWorkHours, allAppointments, editingAppointment])

  const timeSlots = getTimeSlots()

  const handleSave = async () => {
    const { fecha_hora, hora_cita, id_usuario, ...restData } = newAppointmentData
    const combinedDateTime = `${fecha_hora}T${hora_cita}:00`

    if (!id_usuario) {
      toast.error("Por favor, seleccione un paciente.")
      return
    }
    if (!fecha_hora || !hora_cita) {
      toast.error("Por favor, complete la fecha y hora de la cita.")
      return
    }
    if (!restData.notes) {
      toast.error("Por favor, ingrese el motivo de la consulta en las notas.")
      return
    }

    const selectedDateTime = parseISO(combinedDateTime) // Usar parseISO
    if (!editingAppointment && isBefore(selectedDateTime, new Date())) {
      toast.error("No se puede agendar una cita en el pasado.")
      return
    }

    let actualAppointmentDuration = DEFAULT_SESSION_DURATION
    const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[getDay(selectedDateTime)] // Usar getDay
    const relevantSchedule = clinicWorkHours.find((s) => {
      const [sH, sM] = s.hora_inicio.split(":").map(Number)
      const [eH, eM] = s.hora_fin.split(":").map(Number)
      const scheduleStart = setMinutes(setHours(selectedDateTime, sH), sM) // Usar setHours, setMinutes
      const scheduleEnd = setMinutes(setHours(selectedDateTime, eH), eM) // Usar setHours, setMinutes

      return (
        s.dia === selectedDayNameEnglish &&
        (isEqual(selectedDateTime, scheduleStart) || isAfter(selectedDateTime, scheduleStart)) &&
        isBefore(selectedDateTime, scheduleEnd)
      )
    })

    if (relevantSchedule) {
      actualAppointmentDuration = relevantSchedule.duracion_sesion
    } else {
      toast.error(
        "No se encontró un horario de clínica válido para la fecha y hora seleccionadas. Usando duración por defecto.",
      )
    }

    if (!isTimeSlotAvailable(combinedDateTime, allAppointments, editingAppointment?.id_cita)) {
      return
    }

    let nextSessionNumber = restData.numero_sesion
    if (!editingAppointment) {
      const patientCompletedAppointments = allAppointments.filter(
        (cita) => cita.id_usuario === id_usuario && cita.estado === "completada",
      )
      nextSessionNumber = patientCompletedAppointments.length + 1
    }

    const appointmentPayload = {
      ...restData,
      id_usuario: id_usuario,
      fecha_hora: selectedDateTime.toISOString(), // Asegurarse de que sea ISO string
      duracion: actualAppointmentDuration,
      numero_sesion: nextSessionNumber,
    }

    onSave(appointmentPayload, !!editingAppointment)
  }

  if (!isOpen) return null

  console.log("NewAppointmentModal - Slots de tiempo generados:", timeSlots)

  return (
    <div className="new-appointment-modal-overlay">
      <div className="new-appointment-modal">
        <div className="new-appointment-modal-header">
          <h2 className="new-appointment-modal-title">{editingAppointment ? "Editar Cita" : "Programar Nueva Cita"}</h2>
          <p className="new-appointment-modal-description">
            Complete los detalles para {editingAppointment ? "actualizar la" : "agendar una nueva"} cita.
          </p>
        </div>
        <div className="new-appointment-modal-content">
          <div className="new-appointment-form-group">
            <Label htmlFor="user_search">Buscar Paciente</Label>
            <div className="new-appointment-search-relative">
              <Input
                id="user_search"
                type="text"
                placeholder="Buscar por nombre o email..."
                value={userSearchTerm}
                onChange={(e) => handleUserSearch(e.target.value)}
                disabled={!!editingAppointment || !!initialSelectedUser}
              />
              {userSearchLoading && <span className="new-appointment-search-loading">Cargando...</span>}
              {foundUsers.length > 0 && userSearchTerm.length > 2 && !selectedUser && (
                <ul className="new-appointment-user-search-results">
                  {foundUsers.map((user) => (
                    <li
                      key={user.id_usuario}
                      className="new-appointment-user-search-item"
                      onClick={() => handleSelectUser(user)}
                    >
                      <User className="new-appointment-user-icon" />
                      <div className="new-appointment-user-text-container">
                        <span className="new-appointment-user-name">{user.nombre}</span>
                        <span className="new-appointment-user-email">{user.email}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {selectedUser && (
            <div className="new-appointment-form-group">
              <Label>Paciente Seleccionado</Label>
              <div className="new-appointment-selected-user-card">
                <Avatar>
                  <AvatarFallback>{getInitials(selectedUser.nombre)}</AvatarFallback>
                </Avatar>
                <span>
                  {selectedUser.nombre} ({selectedUser.email})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(null)
                    setNewAppointmentData((prev) => ({ ...prev, id_usuario: "" }))
                    setUserSearchTerm("")
                  }}
                  className="new-appointment-change-user-button"
                  disabled={!!editingAppointment || !!initialSelectedUser}
                >
                  Cambiar
                </Button>
              </div>
            </div>
          )}
          <div className="new-appointment-form-group">
            <Label htmlFor="fecha_hora_modal">Fecha</Label>
            <Input
              type="date"
              id="fecha_hora_modal"
              name="fecha_hora"
              value={newAppointmentData.fecha_hora}
              onChange={handleModalInputChange}
              required
            />
          </div>
          <div className="new-appointment-form-group">
            <Label htmlFor="hora_cita_modal">Hora</Label>
            <Select
              id="hora_cita_modal"
              name="hora_cita"
              value={newAppointmentData.hora_cita}
              onValueChange={(value) => handleModalInputChange({ target: { name: "hora_cita", value } })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una hora" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>No hay horas disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="new-appointment-form-group">
            <Label htmlFor="numero_sesion_modal">Número de Sesión</Label>
            <Input
              type="number"
              id="numero_sesion_modal"
              name="numero_sesion"
              value={newAppointmentData.numero_sesion}
              onChange={handleModalInputChange}
              min="1"
              readOnly={!editingAppointment}
              className={!editingAppointment ? "new-appointment-readonly-input" : ""}
            />
          </div>
          <div className="new-appointment-form-group">
            <Label htmlFor="estado_modal">Estado</Label>
            <Select
              id="estado_modal"
              name="estado"
              value={newAppointmentData.estado}
              onValueChange={(value) => handleModalInputChange({ target: { name: "estado", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="postergada">Postergada</SelectItem>
                <SelectItem value="inasistencia">Inasistencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="new-appointment-form-group">
            <Label htmlFor="notes_modal">Notas (Motivo de Consulta)</Label>
            <textarea
              id="notes_modal"
              name="notes"
              value={newAppointmentData.notes}
              onChange={handleModalInputChange}
              className="new-appointment-form-textarea"
              placeholder="Motivo de la consulta o notas adicionales"
              required
            ></textarea>
          </div>
        </div>
        <div className="new-appointment-modal-footer">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : editingAppointment ? "Actualizar Cita" : "Programar Cita"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NewAppointmentModal

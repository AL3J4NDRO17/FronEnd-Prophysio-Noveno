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
    fecha_hora: format(new Date(), "yyyy-MM-dd"),
    hora_cita: "09:00",
    estado: "pendiente", // Se mantendrá aquí para la edición, pero se sobrescribirá para nuevas citas
    notes: "",
    numero_sesion: 1,
  })
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [foundUsers, setFoundUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userSearchLoading, setUserSearchLoading] = useState(false)

  // Efecto para inicializar el modal al abrirse o al cambiar la cita a editar/usuario inicial
  useEffect(() => {
    if (isOpen) {
      if (editingAppointment) {
        const appDate = parseISO(editingAppointment.fecha_hora)
        setNewAppointmentData({
          id_usuario: editingAppointment.id_usuario || "",
          fecha_hora: format(appDate, "yyyy-MM-dd"),
          hora_cita: format(appDate, "HH:mm"),
          estado: editingAppointment.estado || "pendiente", // Usa el estado existente para edición
          notes: editingAppointment.notes || "",
          numero_sesion: editingAppointment.numero_sesion || 1,
        })
        setSelectedUser({
          id_usuario: editingAppointment.id_usuario,
          nombre: editingAppointment.usuario?.nombre,
          email: editingAppointment.usuario?.email,
        })
        setUserSearchTerm(editingAppointment.usuario?.nombre || "")
      } else {
        // Para una cita nueva (con o sin usuario inicial)
        const today = new Date()
        let defaultHour = "09:00"
        if (clinicWorkHours && clinicWorkHours.length > 0) {
          const todayDayNameSpanish = SPANISH_DAYS_OF_WEEK[getDay(today)]
          const firstScheduleForToday = clinicWorkHours.find((s) => s.dia === todayDayNameSpanish)
          if (firstScheduleForToday) {
            defaultHour = firstScheduleForToday.hora_inicio.substring(0, 5)
          }
        }
        setNewAppointmentData({
          id_usuario: initialSelectedUser?.id_usuario || "",
          fecha_hora: format(today, "yyyy-MM-dd"),
          hora_cita: defaultHour,
          estado: "confirmada", // Siempre "confirmada" para nuevas citas
          notes: "",
          numero_sesion: 1, // Por defecto 1, se recalculará si hay usuario seleccionado
        })
        setSelectedUser(initialSelectedUser || null)
        setFoundUsers([])
        setUserSearchTerm(initialSelectedUser?.nombre || "")
      }
    }
  }, [isOpen, editingAppointment, initialSelectedUser, clinicWorkHours])

  // Nuevo efecto para calcular el número de sesión cuando cambia el usuario seleccionado
  useEffect(() => {
    // Solo aplica esta lógica si NO estamos editando una cita existente
    if (!editingAppointment) {
      if (selectedUser) {
        const patientCompletedAppointments = allAppointments.filter(
          (cita) =>
            cita.id_usuario === selectedUser.id_usuario &&
            (cita.estado === "completada" || cita.estado === "pendiente" || cita.estado === "confirmada"), // Incluir confirmada
        )
        const nextSessionNumber = patientCompletedAppointments.length + 1
        setNewAppointmentData((prev) => ({
          ...prev,
          numero_sesion: nextSessionNumber,
        }))
      } else {
        // Si no hay usuario seleccionado, el número de sesión vuelve a 1
        setNewAppointmentData((prev) => ({
          ...prev,
          numero_sesion: 1, // Vuelve a 1 si no hay usuario
        }))
      }
    }
  }, [selectedUser, allAppointments, editingAppointment]) // Dependencias: selectedUser, allAppointments, editingAppointment

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
    const selectedDateTime = parseISO(dateTime)
    const selectedDayIndex = getDay(selectedDateTime)
    const selectedDayNameSpanish = ENGLISH_DAYS_OF_WEEK[selectedDayIndex]

    const daySchedules = clinicWorkHours.filter((schedule) => schedule.dia === selectedDayNameSpanish)
    if (daySchedules.length === 0) {
      toast.error(`La clínica no trabaja los ${SPANISH_DAYS_OF_WEEK[selectedDayIndex]}.`)
      return false
    }

    let isWithinWorkHours = false
    let sessionDuration = 0
    for (const schedule of daySchedules) {
      const [startH, startM] = schedule.hora_inicio.split(":").map(Number)
      const [endH, endM] = schedule.hora_fin.split(":").map(Number)
      const workStartDateTime = setMinutes(setHours(selectedDateTime, startH), startM)
      const workEndDateTime = setMinutes(setHours(selectedDateTime, endH), endM)

      if (
        (isEqual(selectedDateTime, workStartDateTime) || isAfter(selectedDateTime, workStartDateTime)) &&
        isBefore(selectedDateTime, workEndDateTime)
      ) {
        sessionDuration = schedule.duracion_sesion
        const newAppEndTime = addMinutes(selectedDateTime, sessionDuration)
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

    const newAppEndTime = addMinutes(selectedDateTime, sessionDuration)
    for (const app of existingAppointments) {
      if (editingAppId && app.id_cita === editingAppId) continue
      if (app.estado === "cancelada" || app.estado === "completada" || app.estado === "inasistencia") continue

      const existingAppStartTime = parseISO(app.fecha_hora)
      const existingAppDuration = app.duracion || DEFAULT_SESSION_DURATION
      const existingAppEndTime = addMinutes(existingAppStartTime, existingAppDuration)

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

    const selectedDate = parseISO(newAppointmentData.fecha_hora)
    const dayOfWeekIndex = getDay(selectedDate)
    const selectedDayNameSpanish = ENGLISH_DAYS_OF_WEEK[dayOfWeekIndex]

    const daySchedules = clinicWorkHours.filter((schedule) => schedule.dia === selectedDayNameSpanish)
    if (daySchedules.length === 0) return []

    const allPotentialSlots = []
    daySchedules.forEach((schedule) => {
      const [startH, startM] = schedule.hora_inicio.split(":").map(Number)
      const [endH, endM] = schedule.hora_fin.split(":").map(Number)
      const currentSessionDuration = schedule.duracion_sesion

      let current = setMinutes(setHours(selectedDate, startH), startM)
      const end = setMinutes(setHours(selectedDate, endH), endM)

      while (
        isBefore(addMinutes(current, currentSessionDuration), addMinutes(end, 1)) ||
        isEqual(addMinutes(current, currentSessionDuration), end)
      ) {
        allPotentialSlots.push(format(current, "HH:mm"))
        current = addMinutes(current, currentSessionDuration)
      }
    })

    const uniqueSortedPotentialSlots = [...new Set(allPotentialSlots)].sort()

    const filteredSlots = uniqueSortedPotentialSlots.filter((slot) => {
      const potentialAppStart = parseISO(`${newAppointmentData.fecha_hora}T${slot}:00`)
      let currentSlotDuration = 0

      const selectedDayNameSpanishForSlot = SPANISH_DAYS_OF_WEEK[getDay(potentialAppStart)] // Usar SPANISH_DAYS_OF_WEEK aquí
      const relevantSchedule = clinicWorkHours.find((s) => {
        const [sH, sM] = s.hora_inicio.split(":").map(Number)
        const [eH, eM] = s.hora_fin.split(":").map(Number)
        const scheduleStart = setMinutes(setHours(potentialAppStart, sH), sM)
        const scheduleEnd = setMinutes(setHours(potentialAppStart, eH), eM)
        return (
          s.dia === selectedDayNameSpanishForSlot &&
          (isEqual(potentialAppStart, scheduleStart) || isAfter(potentialAppStart, scheduleStart)) &&
          isBefore(potentialAppStart, scheduleEnd)
        )
      })

      if (relevantSchedule) {
        currentSlotDuration = relevantSchedule.duracion_sesion
      } else {
        currentSlotDuration = DEFAULT_SESSION_DURATION
      }

      const potentialAppEnd = addMinutes(potentialAppStart, currentSlotDuration)

      const isOverlapping = allAppointments.some((existingApp) => {
        if (editingAppointment && existingApp.id_cita === editingAppointment.id_cita) return false
        if (
          existingApp.estado === "cancelada" ||
          existingApp.estado === "completada" ||
          existingApp.estado === "inasistencia"
        )
          return false

        const existingAppStartTime = parseISO(existingApp.fecha_hora)
        const existingAppDuration = existingApp.duracion || DEFAULT_SESSION_DURATION
        const existingAppEndTime = addMinutes(existingAppStartTime, existingAppDuration)

        return isBefore(potentialAppStart, existingAppEndTime) && isAfter(potentialAppEnd, existingAppStartTime)
      })
      return !isOverlapping
    })

    return filteredSlots
  }, [newAppointmentData.fecha_hora, clinicWorkHours, allAppointments, editingAppointment])

  const timeSlots = getTimeSlots()

  const handleSave = async () => {
    const { fecha_hora, hora_cita, id_usuario, notes, numero_sesion } = newAppointmentData
    const combinedDateTime = `${fecha_hora}T${hora_cita}:00`

    if (!id_usuario) {
      toast.error("Por favor, seleccione un paciente.")
      return
    }
    if (!fecha_hora || !hora_cita) {
      toast.error("Por favor, complete la fecha y hora de la cita.")
      return
    }
    if (!notes) {
      toast.error("Por favor, ingrese el motivo de la consulta en las notas.")
      return
    }

    const selectedDateTime = parseISO(combinedDateTime)
    if (!editingAppointment && isBefore(selectedDateTime, new Date())) {
      toast.error("No se puede agendar una cita en el pasado.")
      return
    }

    let actualAppointmentDuration = DEFAULT_SESSION_DURATION
    const selectedDayNameSpanish = SPANISH_DAYS_OF_WEEK[getDay(selectedDateTime)]
    const relevantSchedule = clinicWorkHours.find((s) => {
      const [sH, sM] = s.hora_inicio.split(":").map(Number)
      const [eH, eM] = s.hora_fin.split(":").map(Number)
      const scheduleStart = setMinutes(setHours(selectedDateTime, sH), sM)
      const scheduleEnd = setMinutes(setHours(selectedDateTime, eH), eM)
      return (
        s.dia === selectedDayNameSpanish &&
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

    const appointmentPayload = {
      id_usuario: id_usuario,
      fecha_hora: selectedDateTime.toISOString(),
      duracion: actualAppointmentDuration,
      notes: notes,
      numero_sesion: numero_sesion,
      estado: editingAppointment ? newAppointmentData.estado : "confirmada", // Estado condicional
    }

    onSave(appointmentPayload, !!editingAppointment)
  }

  if (!isOpen) return null

  // Determinar si el campo numero_sesion debe ser de solo lectura
  const isSessionNumberReadOnly = !editingAppointment && !!selectedUser

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
              readOnly={isSessionNumberReadOnly}
              className={isSessionNumberReadOnly ? "new-appointment-readonly-input" : ""}
            />
          </div>
          {/* El campo de estado se muestra solo si se está editando una cita */}
          {editingAppointment && (
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
          )}
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

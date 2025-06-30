"use client"

import { useState, useEffect, useCallback } from "react"
import { User } from "lucide-react"
import { Button } from "../../../../public_ui/button"
import { Input } from "../../../../public_ui/input"
import { Label } from "../../../../public_ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../public_ui/select"
import { Avatar, AvatarFallback } from "../../../../public_ui/avatar"
import { toast } from "react-toastify"

// Añadir las siguientes importaciones de CSS al inicio del archivo, después de los imports de React y Lucide:
import "../styles/AppointmentFormModal.css" // Para estilos del modal de formulario

// Helper to get initials
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

// Alinear con el orden que funciona para el usuario: Lunes (0) a Domingo (6)
const ENGLISH_DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const SPANISH_DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

const DEFAULT_SESSION_DURATION = 30 // Declare DEFAULT_SESSION_DURATION here

const NewAppointmentModal = ({
  isOpen,
  onClose,
  onSave, // This will be a function passed from parent to handle actual API calls
  editingAppointment,
  initialSelectedUser, // New prop for pre-selecting a user
  clinicWorkHours, // Ahora es un array de objetos de horario
  allAppointments, // All existing appointments for time slot validation
  userService,
  isSaving, // Loading state from parent
  // Eliminar appointmentDuration
  //- appointmentDuration,
}) => {
  const [newAppointmentData, setNewAppointmentData] = useState({
    id_usuario: "",
    // nombre_paciente: "", // ELIMINADO
    fecha_hora: new Date().toISOString().split("T")[0],
    hora_cita: "09:00",
    estado: "pendiente",
    notes: "",
    numero_sesion: 1,
  })

  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [foundUsers, setFoundUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [userSearchLoading, setUserSearchLoading] = useState(false)

  // Initialize form data and selected user when modal opens or editingAppointment/initialSelectedUser changes
  useEffect(() => {
    if (isOpen) {
      if (editingAppointment) {
        const appDate = new Date(editingAppointment.fecha_hora)
        setNewAppointmentData({
          id_usuario: editingAppointment.id_usuario || "",
          // nombre_paciente: editingAppointment.usuario?.nombre || "", // Ajustado
          fecha_hora: appDate.toISOString().split("T")[0],
          hora_cita: appDate.toTimeString().split(" ")[0].substring(0, 5),
          estado: editingAppointment.estado || "pendiente",
          notes: editingAppointment.notes || "",
          numero_sesion: editingAppointment.numero_sesion || 1,
        })
        setSelectedUser({ id_usuario: editingAppointment.id_usuario, nombre: editingAppointment.usuario?.nombre }) // Ajustado
        setUserSearchTerm(editingAppointment.usuario?.nombre || "") // Ajustado
      } else if (initialSelectedUser) {
        setNewAppointmentData((prev) => ({
          ...prev,
          id_usuario: initialSelectedUser.id_usuario,
          // nombre_paciente: initialSelectedUser.nombre, // ELIMINADO
        }))
        setSelectedUser(initialSelectedUser)
        setUserSearchTerm(initialSelectedUser.nombre)
      } else {
        const today = new Date()
        let defaultHour = "09:00" // Fallback
        // Buscar el primer horario disponible para hoy
        if (clinicWorkHours && clinicWorkHours.length > 0) {
          const todayDayNameEnglish = ENGLISH_DAYS_OF_WEEK[today.getDay()]
          const firstScheduleForToday = clinicWorkHours.find((s) => s.dia === todayDayNameEnglish)
          if (firstScheduleForToday) {
            defaultHour = firstScheduleForToday.hora_inicio.substring(0, 5) // "HH:MM:SS" to "HH:MM"
          }
        }

        setNewAppointmentData({
          id_usuario: "",
          // nombre_paciente: "", // ELIMINADO
          fecha_hora: today.toISOString().split("T")[0],
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
      // nombre_paciente: user.nombre, // ELIMINADO
    }))
    setFoundUsers([])
    setUserSearchTerm(user.nombre)
  }

  const isTimeSlotAvailable = (dateTime, existingAppointments, editingAppId = null) => {
    const newAppStartTime = new Date(dateTime).getTime()
    const selectedDate = new Date(dateTime)
    const selectedDayIndex = selectedDate.getDay()
    const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[selectedDayIndex]

    const daySchedules = clinicWorkHours.filter((schedule) => schedule.dia === selectedDayNameEnglish)

    if (daySchedules.length === 0) {
      toast.error(`La clínica no trabaja los ${SPANISH_DAYS_OF_WEEK[selectedDayIndex]}s.`)
      return false
    }

    let isWithinWorkHours = false
    let sessionDuration = 0 // Duración de la sesión para el slot actual

    for (const schedule of daySchedules) {
      const workStartTimeParts = schedule.hora_inicio.split(":").map(Number)
      const workEndTimeParts = schedule.hora_fin.split(":").map(Number)

      const workStartDateTime = new Date(selectedDate)
      workStartDateTime.setHours(workStartTimeParts[0], workStartTimeParts[1], 0, 0)

      const workEndDateTime = new Date(selectedDate)
      workEndDateTime.setHours(workEndTimeParts[0], workEndTimeParts[1], 0, 0)

      // Check if the new appointment's start time falls within this schedule block
      if (newAppStartTime >= workStartDateTime.getTime() && newAppStartTime < workEndDateTime.getTime()) {
        sessionDuration = schedule.duracion_sesion
        const newAppEndTime = newAppStartTime + sessionDuration * 60 * 1000
        if (newAppEndTime <= workEndDateTime.getTime()) {
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

    const newAppEndTime = newAppStartTime + sessionDuration * 60 * 1000

    for (const app of existingAppointments) {
      if (editingAppId && app.id_cita === editingAppId) continue
      if (app.estado === "cancelada" || app.estado === "completada" || app.estado === "inasistencia") continue // Ignorar citas canceladas, completadas o inasistencia

      const existingAppStartTime = new Date(app.fecha_hora).getTime()
      // Usar la duración de la cita existente o la duración de la sesión por defecto si no está definida
      const existingAppDuration = app.duracion || sessionDuration
      const existingAppEndTime = existingAppStartTime + existingAppDuration * 60 * 1000

      if (newAppStartTime < existingAppEndTime && newAppEndTime > existingAppStartTime) {
        toast.error("El horario seleccionado se superpone con otra cita existente.")
        return false
      }
    }
    return true
  }

  const getTimeSlots = () => {
    const slots = []
    if (!newAppointmentData.fecha_hora || clinicWorkHours.length === 0) return []

    const selectedDate = new Date(newAppointmentData.fecha_hora)
    const dayOfWeekIndex = selectedDate.getDay()
    const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[dayOfWeekIndex]

    const daySchedules = clinicWorkHours.filter((schedule) => schedule.dia === selectedDayNameEnglish)

    if (daySchedules.length === 0) return []

    const allPotentialSlots = []
    daySchedules.forEach((schedule) => {
      const [startH, startM] = schedule.hora_inicio.split(":").map(Number)
      const [endH, endM] = schedule.hora_fin.split(":").map(Number)
      const currentSessionDuration = schedule.duracion_sesion

      const current = new Date(selectedDate)
      current.setHours(startH, startM, 0, 0)

      const end = new Date(selectedDate)
      end.setHours(endH, endM, 0, 0)

      while (current.getTime() + currentSessionDuration * 60 * 1000 <= end.getTime()) {
        const hours = String(current.getHours()).padStart(2, "0")
        const minutes = String(current.getMinutes()).padStart(2, "0")
        allPotentialSlots.push(`${hours}:${minutes}`)
        current.setMinutes(current.getMinutes() + currentSessionDuration)
      }
    })

    const uniqueSortedPotentialSlots = [...new Set(allPotentialSlots)].sort()

    const filteredSlots = uniqueSortedPotentialSlots.filter((slot) => {
      const potentialAppStart = new Date(`${newAppointmentData.fecha_hora}T${slot}:00`).getTime()

      // Find the duration for this specific slot based on the schedule it falls into
      let currentSlotDuration = 0
      const selectedDateForSlot = new Date(`${newAppointmentData.fecha_hora}T${slot}:00`)
      const selectedDayNameEnglishForSlot = ENGLISH_DAYS_OF_WEEK[selectedDateForSlot.getDay()]
      const relevantSchedule = clinicWorkHours.find((s) => {
        const [sH, sM] = s.hora_inicio.split(":").map(Number)
        const [eH, eM] = s.hora_fin.split(":").map(Number)
        const scheduleStart = new Date(selectedDateForSlot)
        scheduleStart.setHours(sH, sM, 0, 0)
        const scheduleEnd = new Date(selectedDateForSlot)
        scheduleEnd.setHours(eH, eM, 0, 0)
        return (
          s.dia === selectedDayNameEnglishForSlot &&
          potentialAppStart >= scheduleStart.getTime() &&
          potentialAppStart < scheduleEnd.getTime()
        )
      })

      if (relevantSchedule) {
        currentSlotDuration = relevantSchedule.duracion_sesion
      } else {
        // Fallback if no specific schedule found for this slot (shouldn't happen if allPotentialSlots is correctly generated)
        currentSlotDuration = DEFAULT_SESSION_DURATION
      }

      const potentialAppEnd = potentialAppStart + currentSlotDuration * 60 * 1000

      const isOverlapping = allAppointments.some((existingApp) => {
        if (editingAppointment && existingApp.id_cita === editingAppointment.id_cita) return false
        if (
          existingApp.estado === "cancelada" ||
          existingApp.estado === "completada" ||
          existingApp.estado === "inasistencia"
        )
          return false // Ignorar citas canceladas, completadas o inasistencia

        const existingAppStartTime = new Date(existingApp.fecha_hora).getTime()
        const existingAppDuration = existingApp.duracion || DEFAULT_SESSION_DURATION // Use existing app duration or default
        const existingAppEndTime = existingAppStartTime + existingAppDuration * 60 * 1000

        return potentialAppStart < existingAppEndTime && potentialAppEnd > existingAppStartTime
      })

      return !isOverlapping
    })

    return filteredSlots
  }
  const timeSlots = getTimeSlots()

  const handleSave = async () => {
    const { fecha_hora, hora_cita, id_usuario, ...restData } = newAppointmentData // 'nombre_paciente' ELIMINADO
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

    // Determinar la duración de la sesión para la cita que se está creando/editando
    let actualAppointmentDuration = DEFAULT_SESSION_DURATION // Fallback
    const selectedDate = new Date(combinedDateTime)
    const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[selectedDate.getDay()]
    const relevantSchedule = clinicWorkHours.find((s) => {
      const [sH, sM] = s.hora_inicio.split(":").map(Number)
      const [eH, eM] = s.hora_fin.split(":").map(Number)
      const scheduleStart = new Date(selectedDate)
      scheduleStart.setHours(sH, sM, 0, 0)
      const scheduleEnd = new Date(selectedDate)
      scheduleEnd.setHours(eH, eM, 0, 0)
      return (
        s.dia === selectedDayNameEnglish &&
        selectedDate.getTime() >= scheduleStart.getTime() &&
        selectedDate.getTime() < scheduleEnd.getTime()
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
      // Para nuevas citas: calcular numero_sesion
      const patientCompletedAppointments = allAppointments.filter(
        (cita) => cita.id_usuario === id_usuario && cita.estado === "completada",
      )
      nextSessionNumber = patientCompletedAppointments.length + 1
    }

    const appointmentPayload = {
      ...restData,
      id_usuario: id_usuario,
      fecha_hora: new Date(combinedDateTime).toISOString(),
      duracion: actualAppointmentDuration, // Usar la duración obtenida dinámicamente
      numero_sesion: nextSessionNumber,
      // nombre_paciente: nombre_paciente, // ELIMINADO
    }

    onSave(appointmentPayload, !!editingAppointment)
  }

  if (!isOpen) return null

  return (
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
            <Label htmlFor="user_search">Buscar Paciente</Label>
            <div className="relative">
              <Input
                id="user_search"
                type="text"
                placeholder="Buscar por nombre o email..."
                value={userSearchTerm}
                onChange={(e) => handleUserSearch(e.target.value)}
                disabled={!!editingAppointment} // Deshabilitar búsqueda si se está editando o si el usuario ya está pre-seleccionado
              />
              {userSearchLoading && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">Cargando...</span>
              )}
              {foundUsers.length > 0 && userSearchTerm.length > 2 && !selectedUser && (
                <ul className="appointmentsAdmin-user-search-results">
                  {foundUsers.map((user) => (
                    <li
                      key={user.id_usuario}
                      className="appointmentsAdmin-user-search-item"
                      onClick={() => handleSelectUser(user)}
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      <div className="appointmentsAdmin-user-search-item-text-container">
                        <span className="appointmentsAdmin-user-search-item-name">{user.nombre}</span>
                        <span className="appointmentsAdmin-user-search-item-email">{user.email}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {selectedUser && (
            <div className="appointmentsAdmin-form-group">
              <Label>Paciente Seleccionado</Label>
              <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md bg-gray-50">
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
                    setNewAppointmentData((prev) => ({ ...prev, id_usuario: "" /* nombre_paciente: "" */ })) // ELIMINADO
                    setUserSearchTerm("")
                  }}
                  className="ml-auto"
                  disabled={!!editingAppointment} // No permitir cambiar si se está editando o pre-seleccionado
                >
                  Cambiar
                </Button>
              </div>
            </div>
          )}

          <div className="appointmentsAdmin-form-group">
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
          <div className="appointmentsAdmin-form-group">
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
                  <SelectItem value="" disabled>
                    No hay horas disponibles
                  </SelectItem>
                )}
              </SelectContent>
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
              readOnly={!editingAppointment}
              className={!editingAppointment ? "bg-gray-100 cursor-not-allowed" : ""}
            />
          </div>
          <div className="appointmentsAdmin-form-group">
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
                <SelectItem value="inasistencia">Inasistencia</SelectItem> {/* Nuevo estado */}
              </SelectContent>
            </Select>
          </div>
          <div className="appointmentsAdmin-form-group">
            <Label htmlFor="notes_modal">Notas (Motivo de Consulta)</Label>
            <textarea
              id="notes_modal"
              name="notes"
              value={newAppointmentData.notes}
              onChange={handleModalInputChange}
              className="appointmentsAdmin-form-textarea"
              placeholder="Motivo de la consulta o notas adicionales"
              required
            ></textarea>
          </div>
        </div>
        <div className="appointmentsAdmin-modal-footer">
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
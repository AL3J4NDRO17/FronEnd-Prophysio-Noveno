"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../public_ui/card"
import { Button } from "../../public_ui/button"
import { Input } from "../../public_ui/input"
import { Label } from "../../public_ui/label"
import { toast } from "react-toastify"
import { Textarea } from "../../public_ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../public_ui/select"
import { format, parseISO, getDay, setHours, setMinutes, addMinutes, isEqual, isBefore, isAfter } from "date-fns"

const ENGLISH_DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const SPANISH_DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function AppointmentDetailsStep({
  onNext,
  onPrev,
  formData,
  onFormChange,
  clinicWorkHours,
  existingAppointments,
  appointmentDuration,
}) {
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  // CAMBIO: selectedFileNames ahora es un array
  const [selectedFileNames, setSelectedFileNames] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    onFormChange(name, value)
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files) // Convertir FileList a Array
    const allowedTypes = ["image/jpeg", "image/png"]
    const maxFiles = 5

    const validFiles = []
    let invalidFilesCount = 0

    if (files.length > maxFiles) {
      toast.error(`Solo puedes subir un máximo de ${maxFiles} imágenes.`)
      e.target.value = null // Limpiar el input
      onFormChange("radiografias", []) // Limpiar el estado
      setSelectedFileNames([])
      return
    }

    files.forEach((file) => {
      if (allowedTypes.includes(file.type)) {
        validFiles.push(file)
      } else {
        invalidFilesCount++
      }
    })

    if (invalidFilesCount > 0) {
      toast.error(`Se ignoraron ${invalidFilesCount} archivo(s) no válido(s). Solo se permiten JPG y PNG.`)
    }

    onFormChange("radiografias", validFiles)
    setSelectedFileNames(validFiles.map((file) => file.name))
  }

  // Función para verificar si un día es laborable para la clínica
  const isDayAvailable = (dateString, clinicWorkHoursData) => {
    if (!dateString || !clinicWorkHoursData || clinicWorkHoursData.length === 0) {
      return false
    }
    const selectedDate = parseISO(dateString)
    const dayOfWeekIndex = getDay(selectedDate)
    const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[dayOfWeekIndex]

    return clinicWorkHoursData.some((schedule) => schedule.dia === selectedDayNameEnglish)
  }

  // Función para generar franjas horarias, ahora considerando la hora de comida
  const generateTimeSlots = (startTime, endTime, lunchStartTime, lunchEndTime, intervalMinutes, selectedDate) => {
    const slots = []
    const [startH, startM] = startTime.split(":").map(Number)
    const [endH, endM] = endTime.split(":").map(Number)

    let current = setMinutes(setHours(selectedDate, startH), startM)
    const end = setMinutes(setHours(selectedDate, endH), endM)

    let lunchStartDateTime = null
    let lunchEndDateTime = null
    if (lunchStartTime && lunchEndTime) {
      const [lunchStartH, lunchStartM] = lunchStartTime.split(":").map(Number)
      const [lunchEndH, lunchEndM] = lunchEndTime.split(":").map(Number)
      lunchStartDateTime = setMinutes(setHours(selectedDate, lunchStartH), lunchStartM)
      lunchEndDateTime = setMinutes(setHours(selectedDate, lunchEndH), lunchEndM)
    }

    if (isEqual(current, end) || isAfter(current, end)) {
      console.warn(
        `[generateTimeSlots] Hora de inicio (${startTime}) es igual o mayor que hora de fin (${endTime}). No se generarán slots.`,
      )
      return []
    }

    while (isBefore(current, end)) {
      const potentialAppEnd = addMinutes(current, intervalMinutes)

      // Verificar si la franja horaria se superpone con la hora de comida
      let isOverlappingLunch = false
      if (lunchStartDateTime && lunchEndDateTime) {
        if (
          (isBefore(current, lunchEndDateTime) && isAfter(potentialAppEnd, lunchStartDateTime)) ||
          isEqual(current, lunchStartDateTime) ||
          isEqual(potentialAppEnd, lunchEndDateTime)
        ) {
          isOverlappingLunch = true
        }
      }

      if (!isOverlappingLunch) {
        slots.push(format(current, "HH:mm"))
      }
      current = addMinutes(current, intervalMinutes)
    }
    return slots
  }

  // Efecto para calcular las franjas horarias disponibles
  useEffect(() => {
    console.log(
      "[AppointmentDetailsStep useEffect] Fecha seleccionada:",
      formData.fecha_cita,
      "Horarios de clínica recibidos:",
      clinicWorkHours,
      "Citas existentes:",
      existingAppointments,
      "Duración de cita (dinámica):",
      appointmentDuration,
    )

    if (formData.fecha_cita && clinicWorkHours.length > 0 && appointmentDuration !== null) {
      const selectedDate = parseISO(formData.fecha_cita)
      const dayOfWeekIndex = getDay(selectedDate)
      const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[dayOfWeekIndex]

      console.log("[AppointmentDetailsStep useEffect] Día de la semana seleccionado (inglés):", selectedDayNameEnglish)

      const daySchedules = clinicWorkHours.filter((schedule) => {
        return schedule.dia === selectedDayNameEnglish
      })

      console.log("[AppointmentDetailsStep useEffect] Horarios de la clínica filtrados para el día:", daySchedules)

      if (daySchedules.length === 0) {
        console.log("[AppointmentDetailsStep useEffect] Día no laboral seleccionado. Limpiando slots y hora.")
        setAvailableTimeSlots([])
        if (formData.hora_cita) {
          onFormChange("hora_cita", "")
        }
        return
      }

      let allPotentialSlots = []
      daySchedules.forEach((schedule) => {
        allPotentialSlots = allPotentialSlots.concat(
          generateTimeSlots(
            schedule.hora_inicio,
            schedule.hora_fin,
            schedule.hora_comida_inicio,
            schedule.hora_comida_fin,
            appointmentDuration,
            selectedDate,
          ),
        )
      })

      const uniqueSortedPotentialSlots = [...new Set(allPotentialSlots)].sort()
      console.log(
        "[AppointmentDetailsStep useEffect] Slots potenciales únicos y ordenados:",
        uniqueSortedPotentialSlots,
      )

      const filteredSlots = uniqueSortedPotentialSlots.filter((slot) => {
        const potentialAppStart = parseISO(`${formData.fecha_cita}T${slot}:00`)
        const potentialAppEnd = addMinutes(potentialAppStart, appointmentDuration)

        const isOverlapping = existingAppointments.some((existingApp) => {
          if (
            existingApp.estado === "cancelada" ||
            existingApp.estado === "completada" ||
            existingApp.estado === "inasistencia"
          ) {
            return false
          }

          if (!existingApp.fecha_hora || typeof existingApp.fecha_hora !== "string") {
            return false
          }

          const existingAppStart = parseISO(existingApp.fecha_hora)
          const existingAppDuration = existingApp.duracion || appointmentDuration
          const existingAppEndTime = addMinutes(existingAppStart, existingAppDuration)

          return isBefore(potentialAppStart, existingAppEndTime) && isAfter(potentialAppEnd, existingAppStart)
        })
        return !isOverlapping
      })

      console.log("[AppointmentDetailsStep useEffect] Slots filtrados (sin superposiciones):", filteredSlots)
      setAvailableTimeSlots(filteredSlots)

      if (formData.hora_cita && !filteredSlots.includes(formData.hora_cita)) {
        console.log(
          "[AppointmentDetailsStep useEffect] Hora seleccionada previamente no válida para la nueva fecha/horarios. Reseteando hora_cita.",
        )
        onFormChange("hora_cita", "")
      }
    } else {
      console.log(
        "[AppointmentDetailsStep useEffect] No hay fecha seleccionada, clinicWorkHours vacío o appointmentDuration no definido. Reseteando slots y hora_cita.",
      )
      setAvailableTimeSlots([])
      if (formData.hora_cita) {
        onFormChange("hora_cita", "")
      }
    }
  }, [formData.fecha_cita, clinicWorkHours, existingAppointments, appointmentDuration, onFormChange])

  const handleNext = () => {
    const { fecha_cita, hora_cita, motivo_consulta } = formData
    if (!fecha_cita || !hora_cita || !motivo_consulta) {
      toast.error("Por favor, complete la fecha, hora y motivo de la cita.")
      return
    }

    // Validación adicional para la hora de comida antes de avanzar
    const selectedDateTime = parseISO(`${fecha_cita}T${hora_cita}:00`)
    const dayOfWeekIndex = getDay(selectedDateTime)
    const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[dayOfWeekIndex]

    const daySchedules = clinicWorkHours.filter((schedule) => schedule.dia === selectedDayNameEnglish)

    let isDuringLunchBreak = false
    for (const schedule of daySchedules) {
      if (schedule.hora_comida_inicio && schedule.hora_comida_fin) {
        const [lunchStartH, lunchStartM] = schedule.hora_comida_inicio.split(":").map(Number)
        const [lunchEndH, lunchEndM] = schedule.hora_comida_fin.split(":").map(Number)
        const lunchStartDateTime = setMinutes(setHours(selectedDateTime, lunchStartH), lunchStartM)
        const lunchEndDateTime = setMinutes(setHours(selectedDateTime, lunchEndH), lunchEndM)

        const potentialAppEnd = addMinutes(selectedDateTime, appointmentDuration)

        if (
          (isBefore(selectedDateTime, lunchEndDateTime) && isAfter(potentialAppEnd, lunchStartDateTime)) ||
          isEqual(selectedDateTime, lunchStartDateTime) ||
          isEqual(potentialAppEnd, lunchEndDateTime)
        ) {
          isDuringLunchBreak = true
          break
        }
      }
    }

    if (isDuringLunchBreak) {
      toast.error("La hora seleccionada cae dentro de la hora de comida de la clínica. Por favor, elija otro horario.")
      return
    }

    onNext()
  }

  const getMinDate = () => {
    return format(new Date(), "yyyy-MM-dd")
  }

  const isNonWorkingDay =
    formData.fecha_cita && clinicWorkHours.length > 0 && !isDayAvailable(formData.fecha_cita, clinicWorkHours)
  const isSelectDisabled = !formData.fecha_cita || isNonWorkingDay || availableTimeSlots.length === 0

  return (
    <Card className="publicAppointment-card-step">
      <CardHeader>
        <CardTitle>Detalles de la Cita y Salud</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="publicAppointment-form-group">
          <Label htmlFor="motivo_consulta">Motivo de la Consulta</Label>
          <Textarea
            id="motivo_consulta"
            name="motivo_consulta"
            value={formData.motivo_consulta}
            onChange={handleChange}
            className="input"
            rows="3"
            required
          ></Textarea>
        </div>
        <div className="publicAppointment-form-group">
          <Label htmlFor="alergias">Alergias (opcional)</Label>
          <Textarea
            id="alergias"
            name="alergias"
            value={formData.alergias}
            onChange={handleChange}
            className="input"
            rows="2"
          ></Textarea>
        </div>
        <div className="publicAppointment-form-group">
          <Label htmlFor="fecha_cita">Fecha de la Cita</Label>
          <Input
            id="fecha_cita"
            name="fecha_cita"
            type="date"
            value={formData.fecha_cita}
            onChange={handleChange}
            min={getMinDate()}
            required
          />
        </div>
        <div className="publicAppointment-form-group">
          <Label htmlFor="hora_cita">Hora de la Cita</Label>
          <Select
            id="hora_cita"
            name="hora_cita"
            value={formData.hora_cita}
            onValueChange={(value) => handleChange({ target: { name: "hora_cita", value } })}
            required
            disabled={isSelectDisabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione una hora" />
            </SelectTrigger>
            <SelectContent>
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>No hay horas disponibles</SelectItem>
              )}
            </SelectContent>
          </Select>
          {!formData.fecha_cita && (
            <p className="publicAppointment-text-xs publicAppointment-text-tertiary mt-1">
              Por favor, seleccione una fecha primero para ver las horas disponibles.
            </p>
          )}
          {formData.fecha_cita && isNonWorkingDay && (
            <p className="publicAppointment-text-xs text-orange-600 mt-1">
              ⚠️ La clínica no atiende en la fecha seleccionada. Por favor, elija un día laboral.
            </p>
          )}
          {formData.fecha_cita && !isNonWorkingDay && availableTimeSlots.length === 0 && (
            <p className="publicAppointment-text-xs publicAppointment-text-tertiary mt-1">
              No hay horas disponibles para la fecha seleccionada (todas las horas están ocupadas).
            </p>
          )}
        </div>
        <div className="publicAppointment-form-group">
          <Label htmlFor="radiografias">Subir Documentos/Radiografías (opcional, máx. 5)</Label>{" "}
          <Input
            id="radiografias"
            name="radiografias"
            type="file"
            onChange={handleFileChange}
            accept="image/jpeg,image/png"
            multiple // CAMBIO: Permitir múltiples archivos
          />
          {selectedFileNames.length > 0 && (
            <div className="publicAppointment-text-xs publicAppointment-text-tertiary mt-1">
              Archivos seleccionados:
              <ul className="list-disc list-inside">
                {selectedFileNames.map((name, index) => (
                  <li key={index}>
                    <strong>{name}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="publicAppointment-form-group">
          <Label htmlFor="radiografia_descripcion">Descripción de Documentos/Radiografías (opcional)</Label>
          <Textarea
            id="radiografia_descripcion"
            name="radiografia_descripcion"
            value={formData.radiografia_descripcion}
            onChange={handleChange}
            className="input"
            rows="2"
            placeholder="Ej: Radiografía de rodilla izquierda, 15/07/2024"
          ></Textarea>
        </div>
      </CardContent>
      <CardFooter className="publicAppointment-card-footer-between">
        <Button variant="outline" onClick={onPrev}>
          Anterior
        </Button>
        <Button onClick={handleNext}>Siguiente</Button>
      </CardFooter>
    </Card>
  )
}

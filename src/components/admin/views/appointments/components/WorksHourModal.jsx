"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../../public_ui/button" // Ruta actualizada
import { Checkbox } from "../../../../public_ui/checkbox" // Ruta actualizada
import { Input } from "../../../../public_ui/input" // Ruta actualizada
import { Label } from "../../../../public_ui/label" // Ruta actualizada
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../public_ui/select"
import { Plus, Trash, Edit, Save, X } from "lucide-react"
import Swal from "sweetalert2"

const ALL_DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const DEFAULT_SESSION_DURATION = 60 // Minutos

const WorkHoursModal = ({ isOpen, onClose, currentWorkHours, onSave }) => {
  const [schedules, setSchedules] = useState([])
  const [editingSchedule, setEditingSchedule] = useState(null) // null for new, object for editing
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Deep copy currentWorkHours to avoid direct mutation
      setSchedules(JSON.parse(JSON.stringify(currentWorkHours)))
      setEditingSchedule(null)
      setShowForm(false)
    }
  }, [currentWorkHours, isOpen])

  const handleAddSchedule = () => {
    setEditingSchedule({
      id: null, // Temporary ID for new entries
      dia: ALL_DAYS[0],
      hora_inicio: "09:00",
      hora_fin: "18:00",
      duracion_sesion: DEFAULT_SESSION_DURATION,
    })
    setShowForm(true)
  }

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(JSON.parse(JSON.stringify(schedule))) // Deep copy
    setShowForm(true)
  }

  const handleDeleteSchedule = async (idToDelete) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el horario seleccionado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (result.isConfirmed) {
      setSchedules((prev) => prev.filter((s) => s.id !== idToDelete))
      Swal.fire("Eliminado!", "El horario ha sido eliminado.", "success")
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setEditingSchedule((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setEditingSchedule((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveForm = () => {
    if (
      !editingSchedule.dia ||
      !editingSchedule.hora_inicio ||
      !editingSchedule.hora_fin ||
      !editingSchedule.duracion_sesion
    ) {
      Swal.fire("Error", "Todos los campos son obligatorios.", "error")
      return
    }
    if (editingSchedule.hora_inicio >= editingSchedule.hora_fin) {
      Swal.fire("Error", "La hora de inicio debe ser anterior a la hora de fin.", "error")
      return
    }
    if (editingSchedule.duracion_sesion <= 0) {
      Swal.fire("Error", "La duración de la sesión debe ser un número positivo.", "error")
      return
    }

    setSchedules((prev) => {
      if (editingSchedule.id === null) {
        // Add new schedule
        return [...prev, { ...editingSchedule, id: Date.now() }] // Assign a temporary unique ID
      } else {
        // Update existing schedule
        return prev.map((s) => (s.id === editingSchedule.id ? editingSchedule : s))
      }
    })
    setShowForm(false)
    setEditingSchedule(null)
  }

  const handleFinalSave = () => {
    onSave(schedules)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="appointmentsAdmin-modal-overlay">
      <div className="appointmentsAdmin-modal" style={{ maxWidth: "700px" }}>
        <div className="appointmentsAdmin-modal-header">
          <h2 className="appointmentsAdmin-modal-title">Ajustar Horario Laboral</h2>
          <p className="appointmentsAdmin-modal-description">
            Define los días, rangos horarios y duración de sesión para las citas.
          </p>
        </div>
        <div className="appointmentsAdmin-modal-content">
          {!showForm ? (
            <>
              <div className="mb-4">
                {schedules.length === 0 ? (
                  <p className="text-gray-500 text-center">No hay horarios configurados.</p>
                ) : (
                  <div className="space-y-3">
                    {schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                      >
                        <div>
                          <p className="font-semibold">{schedule.dia}</p>
                          <p className="text-sm text-gray-600">
                            {schedule.hora_inicio} - {schedule.hora_fin} ({schedule.duracion_sesion} min)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditSchedule(schedule)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteSchedule(schedule.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleAddSchedule} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Añadir Nuevo Horario
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="dia">Día:</Label>
                <Select
                  name="dia"
                  value={editingSchedule?.dia || ""}
                  onValueChange={(value) => handleSelectChange("dia", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un día" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="hora_inicio">Hora Inicio:</Label>
                <Input
                  type="time"
                  id="hora_inicio"
                  name="hora_inicio"
                  value={editingSchedule?.hora_inicio || ""}
                  onChange={handleFormChange}
                />
              </div>
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="hora_fin">Hora Fin:</Label>
                <Input
                  type="time"
                  id="hora_fin"
                  name="hora_fin"
                  value={editingSchedule?.hora_fin || ""}
                  onChange={handleFormChange}
                />
              </div>
              <div className="appointmentsAdmin-form-group">
                <Label htmlFor="duracion_sesion">Duración Sesión (min):</Label>
                <Input
                  type="number"
                  id="duracion_sesion"
                  name="duracion_sesion"
                  value={editingSchedule?.duracion_sesion || ""}
                  onChange={handleFormChange}
                  min="1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSaveForm}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Horario
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="appointmentsAdmin-modal-footer">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleFinalSave} disabled={showForm}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  )
}

export default WorkHoursModal

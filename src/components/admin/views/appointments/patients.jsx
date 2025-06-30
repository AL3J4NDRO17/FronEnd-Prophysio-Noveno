"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Plus, Eye, CalendarDays, Users, Clock } from "lucide-react" // Añadido Users y 
import "../appointments/appointments.css" // CSS principal de la página
import { Input } from "../../../public_ui/input"
import { Button } from "../../../public_ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../public_ui/card"
import { Avatar, AvatarFallback } from "../../../public_ui/avatar"
import { toast } from "react-toastify"
import { userService } from "./services/userService" // Ruta actualizada
import { useCitas } from "./hooks/useCitas" // Para el modal de cita
import { horarioService } from "./services/horarioService" // Para el modal de cita
import NewAppointmentModal from "./components/NewAppointmentModel" // Nuevo componente de modal
import PatientDetailsPanel from "./components/PatientDetailsPanel" // Nuevo componente de panel de detalles

// Helper to get initials
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null)

  const [showPatientDetailsPanel, setShowPatientDetailsPanel] = useState(false)
  const [selectedPatientIdForDetails, setSelectedPatientIdForDetails] = useState(null)

  // Data needed for NewAppointmentModal
  const { citas, crearCita, actualizarCita, loading: loadingCitas } = useCitas()
  const [appointmentDuration, setAppointmentDuration] = useState(null)
  const [clinicWorkHours, setClinicWorkHours] = useState([])

  // Load clinic data for appointment modal
  useEffect(() => {
    const loadClinicData = async () => {
      try {
        const hours = await horarioService.getHorariosClinica()
        setClinicWorkHours(hours)
        if (hours.length > 0 && hours[0].duracion_sesion) {
          setAppointmentDuration(hours[0].duracion_sesion)
        } else {
          setAppointmentDuration(60) // Default if not found
          console.warn("No se encontró 'duracion_sesion' en los horarios, usando 60 minutos por defecto.")
        }
      } catch (err) {
        console.error("Error al cargar horarios de la clínica:", err)
        toast.error("No se pudieron cargar los horarios de la clínica.")
        setAppointmentDuration(60) // Fallback
      }
    }
    loadClinicData()
  }, [])

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.getAllUsers()
      // Filtrar para mostrar solo usuarios que no son 'admin'
      const nonAdminPatients = data.filter((user) => user.rol !== "admin")
      setPatients(nonAdminPatients)
    } catch (err) {
      console.error("Error al cargar pacientes:", err)
      setError(err.message || "Error al cargar pacientes")
      toast.error("No se pudieron cargar los pacientes.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const handleSearch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.searchUsers(searchTerm)
      // Filtrar para mostrar solo usuarios que no son 'admin'
      const nonAdminPatients = data.filter((user) => user.rol !== "admin")
      setPatients(nonAdminPatients)
    } catch (err) {
      console.error("Error al buscar pacientes:", err)
      setError(err.message || "Error al buscar pacientes")
      toast.error("Error al buscar pacientes.")
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  const openScheduleAppointmentModal = (patient) => {
    setSelectedPatientForAppointment(patient)
    setShowNewAppointmentModal(true)
  }

  const handleSaveAppointment = async (appointmentPayload, isEditing) => {
    try {
      if (isEditing) {
        await actualizarCita(appointmentPayload.id_cita, appointmentPayload)
      } else {
        await crearCita(appointmentPayload)
      }
      setShowNewAppointmentModal(false)
      setSelectedPatientForAppointment(null)
    } catch (err) {
      // toast handled by useCitas
    }
  }

  const openPatientDetailsPanel = (patientId) => {
    setSelectedPatientIdForDetails(patientId)
    setShowPatientDetailsPanel(true)
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // --- Cálculo de Estadísticas ---
  const totalPatients = patients.length

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const patientsWithUpcomingAppointments = new Set(
    citas
      .filter((cita) => {
        const citaDate = new Date(cita.fecha_hora)
        citaDate.setHours(0, 0, 0, 0)
        return (
          (cita.estado === "pendiente" || cita.estado === "confirmada" || cita.estado === "postergada") &&
          citaDate >= today &&
          patients.some((p) => p.id_usuario === cita.id_usuario)
        ) // Asegurarse de que sea un paciente no-admin
      })
      .map((cita) => cita.id_usuario),
  ).size

  return (
    <div className="appointmentsAdmin-container">
      <header className="appointmentsAdmin-header">
        <div className="appointmentsAdmin-header-title">
          <h1>Gestión de Pacientes</h1>
        </div>
        <div className="appointmentsAdmin-header-actions">
          <div className="appointmentsAdmin-search-container">
            <Search className="appointmentsAdmin-search-icon" />
            <Input
              type="text"
              placeholder="Buscar pacientes..."
              className="appointmentsAdmin-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch()
              }}
            />
          </div>
          <Button variant="primary" onClick={() => openScheduleAppointmentModal(null)}>
            <Plus className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-mr" />
            Nuevo Paciente / Cita
          </Button>
        </div>
      </header>

      <main className="appointmentsAdmin-main">
        {/* Sección de Estadísticas */}
        <div className="appointmentsAdmin-stats-grid mb-6">
          <Card className="appointmentsAdmin-card">
            <CardContent className="appointmentsAdmin-card-content flex items-center gap-4">
              <div className="appointmentsAdmin-stat-icon appointmentsAdmin-stat-icon-time">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="appointmentsAdmin-stat-label">Total de Pacientes</p>
                <p className="appointmentsAdmin-stat-value">{totalPatients}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="appointmentsAdmin-card">
            <CardContent className="appointmentsAdmin-card-content flex items-center gap-4">
              <div className="appointmentsAdmin-stat-icon appointmentsAdmin-stat-icon-pending">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="appointmentsAdmin-stat-label">Pacientes con Citas Próximas</p>
                <p className="appointmentsAdmin-stat-value">{patientsWithUpcomingAppointments}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="appointmentsAdmin-card">
          <CardHeader className="appointmentsAdmin-card-header">
            <CardTitle className="appointmentsAdmin-card-title">Lista de Pacientes</CardTitle>
          </CardHeader>
          <CardContent className="appointmentsAdmin-card-content">
            {loading && <p>Cargando pacientes...</p>}
            {error && <p>Error al cargar pacientes: {error.message || error}</p>}
            {!loading && !error && filteredPatients.length === 0 && (
              <p>No hay pacientes registrados que coincidan con la búsqueda.</p>
            )}
            {!loading && !error && filteredPatients.length > 0 && (
              <table className="appointmentsAdmin-table">
                <thead>
                  <tr>
                    <th className="appointmentsAdmin-th">Nombre</th>
                    <th className="appointmentsAdmin-th">Email</th>
                    <th className="appointmentsAdmin-th">Rol</th>
                    <th className="appointmentsAdmin-th appointmentsAdmin-th-actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id_usuario}>
                      <td className="appointmentsAdmin-td">
                        <div className="appointmentsAdmin-patient-info">
                          <Avatar>
                            <AvatarFallback>{getInitials(patient.nombre)}</AvatarFallback>
                          </Avatar>
                          <div>{patient.nombre}</div>
                        </div>
                      </td>
                      <td className="appointmentsAdmin-td">{patient.email}</td>
                      <td className="appointmentsAdmin-td">{patient.rol}</td>
                      <td className="appointmentsAdmin-td appointmentsAdmin-td-actions">
                        <div className="appointmentsAdmin-actions">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPatientDetailsPanel(patient.id_usuario)}
                            title="Ver Detalles"
                          >
                            <Eye className="appointmentsAdmin-icon-sm" />
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openScheduleAppointmentModal(patient)}
                            title="Agendar Cita"
                          >
                            <CalendarDays className="appointmentsAdmin-icon-sm" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* New/Edit Appointment Modal (reused component) */}
      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSave={handleSaveAppointment}
        editingAppointment={null} // Always null when opened from patients page for new appointment
        initialSelectedUser={selectedPatientForAppointment}
        appointmentDuration={appointmentDuration}
        clinicWorkHours={clinicWorkHours}
        allAppointments={citas}
        userService={userService}
        isSaving={loadingCitas}
      />

      {/* Patient Details Panel (new component) */}
      <PatientDetailsPanel
        isOpen={showPatientDetailsPanel}
        onClose={() => setShowPatientDetailsPanel(false)}
        patientId={selectedPatientIdForDetails}
        onScheduleAppointment={(patient) => {
          setShowPatientDetailsPanel(false) // Close details panel
          openScheduleAppointmentModal(patient) // Open appointment modal
        }}
      />
    </div>
  )
}

export default PatientsPage

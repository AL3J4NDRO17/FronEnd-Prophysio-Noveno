"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Search, Plus, Eye, CalendarDays, Users, Clock, XCircle } from "lucide-react" // Añadido XCircle para limpiar búsqueda
import "./patients.css" // Importar el CSS dedicado para pacientes
import { Input } from "../../../public_ui/input"
import { Button } from "../../../public_ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../public_ui/card"
import { Avatar, AvatarFallback } from "../../../public_ui/avatar"
import { toast } from "react-toastify"
import { userService } from "./services/userService"
import { useCitas } from "./hooks/useCitas"
import { horarioService } from "./services/horarioService"

import NewAppointmentModal from "./components/NewAppointmentModel"
import PatientDetailsPanel from "./components/PatientDetailsPanel"

// Helper to get initials
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

// Helper para formatear fecha y hora
const formatDateTime = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all") // Nuevo estado para el filtro

  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null)

  const [showPatientDetailsPanel, setShowPatientDetailsPanel] = useState(false)
  const [selectedPatientIdForDetails, setSelectedPatientIdForDetails] = useState(null)

  // Data needed for NewAppointmentModal
  const { citas, crearCita, actualizarCita, loading: loadingCitas } = useCitas()
  const [clinicWorkHours, setClinicWorkHours] = useState([])

  // Load clinic data for appointment modal
  useEffect(() => {
    const loadClinicData = async () => {
      try {
        const hours = await horarioService.getHorariosClinica()
        setClinicWorkHours(hours)
      } catch (err) {
        console.error("Error al cargar horarios de la clínica:", err)
        toast.error("No se pudieron cargar los horarios de la clínica.")
      }
    }
    loadClinicData()
  }, [])

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.getAllUsers()
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

  const clearSearch = () => {
    setSearchTerm("")
    fetchPatients() // Recargar todos los pacientes
  }

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

  const filteredPatients = useMemo(() => {
    const searchFiltered = patients.filter(
      (patient) =>
        patient.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterStatus === "all") {
      return searchFiltered
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return searchFiltered.filter((patient) => {
      const hasUpcoming = citas.some((cita) => {
        const citaDate = new Date(cita.fecha_hora)
        citaDate.setHours(0, 0, 0, 0)
        return (
          cita.id_usuario === patient.id_usuario &&
          (cita.estado === "pendiente" || cita.estado === "confirmada" || cita.estado === "postergada") &&
          citaDate >= today
        )
      })

      if (filterStatus === "with_upcoming_appointments") {
        return hasUpcoming
      }
      if (filterStatus === "no_upcoming_appointments") {
        return !hasUpcoming
      }
      return true
    })
  }, [patients, searchTerm, filterStatus, citas])

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
          (cita.estado === "confirmada" || cita.estado === "pendiente" || cita.estado === "postergada") &&
          citaDate >= today &&
          patients.some((p) => p.id_usuario === cita.id_usuario)
        )
      })
      .map((cita) => cita.id_usuario),
  ).size

  // --- Actividad Reciente de Citas ---
  const recentAppointments = useMemo(() => {
    // Filtra citas que tienen un usuario asociado y ordena por fecha_hora descendente
    return citas
      .filter((cita) => cita.usuario && cita.usuario.nombre) // Asegura que el usuario y su nombre existan
      .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime())
      .slice(0, 7) // Obtén las 7 citas más recientes
  }, [citas])

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
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500 hover:text-gray-700"
                title="Limpiar búsqueda"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button variant="primary" onClick={() => openScheduleAppointmentModal(null)}>
            <Plus className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-mr" />
            Nuevo Paciente / Cita
          </Button>
        </div>
      </header>

      <main className="appointmentsAdmin-main">
        <div className="appointmentsAdmin-dashboard-grid">
          {/* Sección de Estadísticas */}
          <div className="appointmentsAdmin-stats-grid">
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

          {/* Nueva Tarjeta: Actividad Reciente de Citas */}
          <Card className="appointmentsAdmin-card appointmentsAdmin-recent-activity-card">
            <CardHeader className="appointmentsAdmin-card-header">
              <CardTitle className="appointmentsAdmin-card-title">Actividad Reciente de Citas</CardTitle>
            </CardHeader>
            <CardContent className="appointmentsAdmin-card-content">
              {recentAppointments.length > 0 ? (
                <ul className="appointmentsAdmin-recent-list">
                  {recentAppointments.map((cita) => (
                    <li key={cita.id_cita} className="appointmentsAdmin-recent-item">
                      <Avatar>
                        <AvatarFallback className="appointmentsAdmin-avatar">
                          {getInitials(cita.usuario?.nombre || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="appointmentsAdmin-recent-item-info">
                        <p className="appointmentsAdmin-recent-item-patient">
                          {cita.usuario?.nombre || "Paciente Desconocido"}
                        </p>
                        <p className="appointmentsAdmin-recent-item-details">{formatDateTime(cita.fecha_hora)}</p>
                      </div>
                      <span className={`appointmentsAdmin-badge ${cita.estado}`}>{cita.estado}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500">No hay actividad reciente de citas.</p>
              )}
              <div className="mt-4 text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    /* Navegar a la página de citas */
                  }}
                >
                  Ver todas las citas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Pacientes (existente) */}
          <Card className="appointmentsAdmin-card appointmentsAdmin-patients-list-card">
            <CardHeader className="appointmentsAdmin-card-header">
              <CardTitle className="appointmentsAdmin-card-title">Lista de Pacientes</CardTitle>
            </CardHeader>
            <CardContent className="appointmentsAdmin-card-content">
              {/* Filtros de estado */}
              <div className="appointmentsAdmin-filters">
                <Button
                  className={`appointmentsAdmin-filter-button ${filterStatus === "all" ? "active" : ""}`}
                  onClick={() => setFilterStatus("all")}
                >
                  Todos
                </Button>
                <Button
                  className={`appointmentsAdmin-filter-button ${filterStatus === "with_upcoming_appointments" ? "active" : ""}`}
                  onClick={() => setFilterStatus("with_upcoming_appointments")}
                >
                  Con Citas Próximas
                </Button>
                <Button
                  className={`appointmentsAdmin-filter-button ${filterStatus === "no_upcoming_appointments" ? "active" : ""}`}
                  onClick={() => setFilterStatus("no_upcoming_appointments")}
                >
                  Sin Citas Próximas
                </Button>
              </div>

              {loading && <p>Cargando pacientes...</p>}
              {error && <p>Error al cargar pacientes: {error.message || error}</p>}
              {!loading && !error && filteredPatients.length === 0 && (
                <p>No hay pacientes registrados que coincidan con la búsqueda o los filtros.</p>
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
                        <td className="appointmentsAdmin-td" data-label="Nombre">
                          <div className="appointmentsAdmin-patient-info">
                            <Avatar>
                              <AvatarFallback className="appointmentsAdmin-avatar">
                                {getInitials(patient.nombre)}
                              </AvatarFallback>
                            </Avatar>
                            <div>{patient.nombre}</div>
                          </div>
                        </td>
                        <td className="appointmentsAdmin-td" data-label="Email">
                          {patient.email}
                        </td>
                        <td className="appointmentsAdmin-td" data-label="Rol">
                          {patient.rol}
                        </td>
                        <td className="appointmentsAdmin-td appointmentsAdmin-td-actions" data-label="Acciones">
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
        </div>
      </main>

      {/* New/Edit Appointment Modal (reused component) */}
      <NewAppointmentModal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        onSave={handleSaveAppointment}
        editingAppointment={null} // Always null when opened from patients page for new appointment
        initialSelectedUser={selectedPatientForAppointment}
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

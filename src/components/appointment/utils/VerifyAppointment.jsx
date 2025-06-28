"use client"

import { useEffect, useState } from "react"
// Para React puro, usarías 'react-router-dom' o similar para 'useSearchParams' y 'Link'
// Para esta demostración, simularemos la obtención del ID de la URL y la redirección.
import { citaService } from "../services/appointmentService"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../public_ui/card"
import { Button } from "../../public_ui/button"
import { CheckCircle, XCircle, Loader } from "lucide-react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../styles/Confirmation.css" // Importa el CSS personalizado

export default function AppointmentConfirmationPage() {
  // Simulación de useSearchParams para obtener el ID de la URL
  // En una aplicación React real con react-router-dom, usarías:
  // const searchParams = new URLSearchParams(useLocation().search);
  // const appointmentId = searchParams.get("id");
  const [appointmentId, setAppointmentId] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    console.log("Parámetros de la URL:", params)
    setAppointmentId(params.get("id"))
  }, [])

  const [loading, setLoading] = useState(true)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("ID de cita obtenido:", appointmentId)
    const confirmAppointment = async () => {
      if (!appointmentId) {
        setError("ID de cita no proporcionado en la URL.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Llama al servicio para confirmar la cita
        await citaService.confirmarCitaPorToken(appointmentId)
        setConfirmed(true)
        toast.success("¡Cita confirmada exitosamente!")
        // Redirige al usuario a la página de agendar-cita después de un breve retraso
        // En una aplicación React real con react-router-dom, usarías:
        // useNavigate()('/agendar-cita');
        setTimeout(() => {
          window.location.href = "/user/sheduler" // Redirección simple para React puro
        }, 3000)
      } catch (err) {
        console.error("Error al confirmar cita:", err)
        setError(err.response?.data?.message || "Error al confirmar la cita. Por favor, intente de nuevo.")
        toast.error(err.response?.data?.message || "Error al confirmar la cita.")
        setConfirmed(false)
      } finally {
        setLoading(false)
      }
    }

    if (appointmentId) {
      confirmAppointment()
    }
  }, [appointmentId])

  return (
    <div className="confirmation-page-container">
      <Card className="confirmation-card">
        <CardHeader className="confirmation-card-header">
          <CardTitle className="confirmation-card-title">Confirmación de Cita</CardTitle>
          <CardDescription className="confirmation-card-description">
            {loading
              ? "Verificando su cita..."
              : confirmed
                ? "Su cita ha sido confirmada."
                : "Hubo un problema con la confirmación."}
          </CardDescription>
        </CardHeader>
        <CardContent className="confirmation-card-content">
          {loading && (
            <div className="confirmation-status-message">
              <Loader className="confirmation-icon loading-icon" />
              <p>Cargando...</p>
            </div>
          )}
          {!loading && confirmed && (
            <div className="confirmation-status-message success">
              <CheckCircle className="confirmation-icon success-icon" />
              <p>¡Su cita ha sido confirmada exitosamente!</p>
              <p>Será redirigido a sus citas en breve.</p>
            </div>
          )}
          {!loading && !confirmed && error && (
            <div className="confirmation-status-message error">
              <XCircle className="confirmation-icon error-icon" />
              <p>Error: {error}</p>
              <p>Por favor, intente de nuevo o contacte a soporte.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="confirmation-card-footer">
          {!loading && (
            <a href="/agendar-cita">
              {" "}
              {/* Usar <a> tag para navegación simple en React puro */}
              <Button className="confirmation-button">Volver a Agendar Cita</Button>
            </a>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

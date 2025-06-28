"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useCitas } from "../hooks/useCitas" // Todavía necesario para obtener citas existentes para validación
import { useAgendarCita } from "../hooks/useAddCitas" // Nuevo hook
import ConfirmationStep from "../components/ConfirmationStep" // Nuevo componente de confirmación
import TermsAndConditionsStep from "../components/TermsAndConditionsStep"
import ClientDetailsStep from "../components/ClientDetailsStep"
import AppointmentDetailsStep from "../components/AppointmentDetailsStep"
import SummaryStep from "../components/SummaryStep" // Importar el nuevo componente de resumen
import PaymentOptionStep from "../components/PaymentOptionStep"
import { Card, CardContent } from "../../public_ui/card"
import "../styles/NewAppointmentStepper.css"

// Default work hours (example) - Should ideally come from a global config or API
const DEFAULT_WORK_HOURS = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // Días en inglés
  startTime: "09:00",
  endTime: "18:00",
}
const NewAppointmentStepper = ({ userId }) => {
  // Recibe userId como prop
  const {
    perfil,
    loading: hookLoading,
    paso,
    incompleto,
    error: hookError,
    citaCreada,
    guardarDatosCliente,
    agendarCita,
  } = useAgendarCita(userId) // Pasa userId al hook

  // Estado local para los datos del formulario que se irán recolectando
  const [formData, setFormData] = useState({
    termsAccepted: false,
    // Client Details (se precargarán desde 'perfil' si existe)
    nombre_paciente: "",
    sexo: "",
    telefono: "",
    // email: "", // Campo de email eliminado
    // Appointment Details & Health
    alergias: "", // maps to datosExtra.alergias
    motivo_consulta: "", // new field, maps to datosExtra.motivo_consulta
    fecha_cita: "", // YYYY-MM-DD
    hora_cita: "", // HH:MM
    radiografias: null, // Nuevo campo para archivos (File o FileList)
    // Payment
    metodo_pago: "",
    estado: "pendiente", // Default state for new appointments
  })

  // Cargar citas existentes para la validación de solapamiento
  const { citas, loading: citasLoading } = useCitas()

  // Sincronizar el estado del formulario con el perfil cargado
  useEffect(() => {
    if (perfil) {
      setFormData((prev) => ({
        ...prev,
        nombre_paciente: perfil.nombre_completo || "",
        sexo: perfil.sexo || "",
        telefono: perfil.telefono || "",
        email: perfil.email || "", // Aunque se eliminó el input, si el perfil lo tiene, se carga
      }))
    }
  }, [perfil])

  // Sincronizar el paso del hook con el estado local del stepper
  const [currentStep, setCurrentStep] = useState(1)
  useEffect(() => {
    // Si el hook indica que la cita fue creada (paso 4), podemos resetear el stepper
    // o manejar la redirección/mensaje de éxito aquí si es necesario.
    // Por ahora, el AgendarCitaPage ya maneja la visualización de UserAppointmentDetails
    // cuando citaCreada es true.
    if (citaCreada && paso === 4) {
      // Opcional: resetear el formulario si el usuario va a agendar otra cita
      // setFormData(...)
      // setCurrentStep(1)
    } else {
      setCurrentStep(paso)
    }
  }, [paso, citaCreada])

  // Manejar errores del hook
  useEffect(() => {
    if (hookError) {
      toast.error(hookError)
    }
  }, [hookError])

  // Simulate fetching work hours (in a real app, this would be from localStorage or an API)
  const [workHours, setWorkHours] = useState(DEFAULT_WORK_HOURS)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("prophysioWorkHours")
      if (saved) {
        setWorkHours(JSON.parse(saved))
      }
    }
  }, [])

  const handleFormChange = (name, value) => {
    if (name === "radiografias") {
      setFormData((prev) => ({ ...prev, [name]: value.length > 0 ? value[0] : null }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!formData.termsAccepted) {
        toast.error("Debe aceptar los términos y condiciones para continuar.")
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (!formData.nombre_paciente || !formData.sexo || !formData.telefono) {
        toast.error("Por favor, complete todos los campos obligatorios: Nombre, Sexo y Teléfono.")
        return
      }
      await guardarDatosCliente(
        {
          nombre: formData.nombre_paciente,
          sexo: formData.sexo,
          telefono: formData.telefono,
          email: formData.email,
        },
        {
          alergias: formData.alergias,
          motivo_consulta: formData.motivo_consulta,
        },
      )
    } else if (currentStep === 3) {
      const { fecha_cita, hora_cita, motivo_consulta } = formData
      const defaultDuration = "30"

      if (!fecha_cita || !hora_cita || !motivo_consulta) {
        toast.error("Por favor, complete la fecha, hora y motivo de la cita.")
        return
      }

      const combinedDateTime = `${fecha_cita}T${hora_cita}:00`
      if (!isTimeSlotAvailable(combinedDateTime, defaultDuration, citas, workHours)) {
        return
      }
      setCurrentStep(4) // Avanza al paso de pago
    } else if (currentStep === 4) {
      if (!formData.metodo_pago) {
        toast.error("Por favor, seleccione un método de pago.")
        return
      }
      setCurrentStep(5) // Avanza al paso de resumen
    } else if (currentStep === 5) {
      // Desde el resumen, avanza al nuevo paso de confirmación
      setCurrentStep(6)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmitAppointment = async () => {
    // Esta función ahora se llama desde ConfirmationStep
    const combinedDateTime = `${formData.fecha_cita}T${formData.hora_cita}:00`
    const defaultDuration = 30

    const citaFormData = new FormData()
    citaFormData.append("id_usuario", userId)
    citaFormData.append("fecha_hora", new Date(combinedDateTime).toISOString())
    citaFormData.append(
      "notes",
      `Motivo: ${formData.motivo_consulta || "N/A"} | Alergias: ${formData.alergias || "Ninguna"}`,
    )
    citaFormData.append("estado", formData.estado)
    citaFormData.append("duracion", defaultDuration.toString())
    citaFormData.append("metodo_pago", formData.metodo_pago) // Asegúrate de enviar el método de pago

    if (formData.radiografias) {
      citaFormData.append("radiografias", formData.radiografias)
    }

    await agendarCita(citaFormData)

    // El hook se encarga de actualizar 'paso' a 4 si la cita se creó exitosamente.
    // El AgendarCitaPage detectará esto y mostrará UserAppointmentDetails.
    // No es necesario resetear el formulario aquí, ya que el AgendarCitaPage cambiará la vista.
  }

  const ENGLISH_DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const isTimeSlotAvailable = (dateTime, duration, existingAppointments, workHoursConfig) => {
    const newAppStartTime = new Date(dateTime).getTime()
    const newAppEndTime = newAppStartTime + Number.parseInt(duration) * 60 * 1000

    const selectedDay = new Date(dateTime).getDay()
    const dayName = ENGLISH_DAYS_OF_WEEK[selectedDay]

    if (!workHoursConfig.days.includes(dayName)) {
      toast.error(`La clínica no trabaja los ${dayName}s.`)
      return false
    }

    const workStartTimeParts = workHoursConfig.startTime.split(":")
    const workEndTimeParts = workHoursConfig.endTime.split(":")

    const workStartDateTime = new Date(dateTime)
    workStartDateTime.setHours(Number.parseInt(workStartTimeParts[0]), Number.parseInt(workStartTimeParts[1]), 0, 0)

    const workEndDateTime = new Date(dateTime)
    workEndDateTime.setHours(Number.parseInt(workEndTimeParts[0]), Number.parseInt(workEndTimeParts[1]), 0, 0)

    if (newAppStartTime < workStartDateTime.getTime() || newAppEndTime > workEndDateTime.getTime()) {
      toast.error(
        `El horario seleccionado está fuera del horario laboral (${workHoursConfig.startTime} - ${workHoursConfig.endTime}).`,
      )
      return false
    }

    for (const app of existingAppointments) {
      if (app.estado === "cancelada" || app.estado === "completada") continue

      const existingAppStartTime = new Date(app.fecha_cita).getTime()
      const existingAppEndTime = existingAppStartTime + (app.duracion || 30) * 60 * 1000

      if (newAppStartTime < existingAppEndTime && newAppEndTime > existingAppStartTime) {
        toast.error("El horario seleccionado se superpone con otra cita existente.")
        return false
      }
    }
    return true
  }

  // Actualizado para 5 pasos + 1 de confirmación
  const stepTitles = [
    "Términos y Condiciones",
    "Datos del Cliente",
    "Detalles de la Cita y Salud",
    "Opciones de Pago",
    "Resumen de la Cita",
    "Confirmación Final", // Nuevo paso
  ]

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <TermsAndConditionsStep onNext={handleNextStep} formData={formData} onFormChange={handleFormChange} />
      case 2:
        return (
          <ClientDetailsStep
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            formData={formData}
            onFormChange={handleFormChange}
          />
        )
      case 3:
        return (
          <AppointmentDetailsStep
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            formData={formData}
            onFormChange={handleFormChange}
            workHours={workHours}
            existingAppointments={citas}
          />
        )
      case 4:
        return (
          <PaymentOptionStep
            onNext={handleNextStep}
            onPrev={handlePrevStep}
            formData={formData}
            onFormChange={handleFormChange}
            loading={hookLoading || citasLoading}
          />
        )
      case 5:
        return (
          <SummaryStep
            onPrev={handlePrevStep}
            onNext={handleNextStep} // Ahora avanza al siguiente paso, no envía
            onSubmit={handleSubmitAppointment}
            formData={formData}
            loading={hookLoading || citasLoading}
          />
        )
      case 6: // Nuevo paso de confirmación
        return (
          <ConfirmationStep
  
        
            loading={hookLoading || citasLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="publicAppointment-stepper-outer-wrapper">
      <div className="newAppointment-stepper-layout">
        <div className="newAppointment-stepper-progress">
          <div className="newAppointment-stepper-line"></div>
          {stepTitles.map((title, index) => (
            <div key={index} className="newAppointment-stepper-step">
              <div
                className={`newAppointment-stepper-dot ${currentStep >= index + 1 ? "newAppointment-stepper-dot--completed" : ""} ${currentStep === index + 1 ? "newAppointment-stepper-dot--active" : ""}`}
              >
                {currentStep <= index + 1 && <span>{index + 1}</span>}
              </div>
              <div
                className={`newAppointment-stepper-step-title ${currentStep === index + 1 ? "newAppointment-stepper-step-title--active" : ""}`}
              >
                {title}
              </div>
            </div>
          ))}
        </div>
        <div className="newAppointment-stepper-content-area">{renderStepComponent()}</div>
      </div>
    </div>
  )
}


export default NewAppointmentStepper

"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useCitas } from "../hooks/useCitas" // Ruta actualizada
import { useAgendarCita } from "../hooks/useAddCitas" // Ruta actualizada
import ConfirmationStep from "../components/ConfirmationStep"
import TermsAndConditionsStep from "../components/TermsAndConditionsStep"
import ClientDetailsStep from "../components/ClientDetailsStep"
import AppointmentDetailsStep from "../components/AppointmentDetailsStep"
import SummaryStep from "../components/SummaryStep"
import PaymentOptionStep from "../components/PaymentOptionStep" // Nuevo componente de pago
import "../styles/NewAppointmentStepper.css"
import { horarioService } from "../services/clinicHoursService" // Ruta actualizada

const ENGLISH_DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const SPANISH_TO_ENGLISH_DAY_MAP = {
  Domingo: "Sunday",
  Lunes: "Monday",
  Martes: "Tuesday",
  Miércoles: "Wednesday",
  Jueves: "Thursday",
  Viernes: "Friday",
  Sábado: "Saturday",
}

const NewAppointmentStepper = ({
  userId,
  clinicWorkHours: propClinicWorkHours,
  existingAppointments: propExistingAppointments,
}) => {
  const {
    perfil,
    loading: hookLoading,
    paso,
    incompleto,
    error: hookError,
    citaCreada,
    guardarDatosCliente,
    agendarCita,
  } = useAgendarCita(userId)

  const [formData, setFormData] = useState({
    termsAccepted: false,
    nombre_paciente: "",
    sexo: "",
    telefono: "",
    alergias: "",
    motivo_consulta: "",
    fecha_cita: "",
    hora_cita: "",
    radiografias: [], // Inicializar como un array vacío para múltiples archivos
    radiografia_descripcion: "", // Nuevo campo para la descripción de la radiografía
    metodo_pago: "",
    estado: "pendiente",
  })

  const { citas, loading: citasLoading } = useCitas()
  const [clinicWorkHours, setClinicWorkHours] = useState([])
  const [appointmentDuration, setAppointmentDuration] = useState(null)
  const [configLoading, setConfigLoading] = useState(true)

  // Cargar horarios de la clínica y obtener la duración de la sesión
  useEffect(() => {
    const loadClinicData = async () => {
      try {
        setConfigLoading(true)
        console.log("NewAppointmentStepper: Intentando cargar horarios de la clínica...")
        const hours = await horarioService.getHorariosClinica()
        console.log("NewAppointmentStepper: Horarios de la clínica cargados (raw):", hours)
        // Normalizar los nombres de los días a inglés para consistencia
        const normalizedHours = hours.map((schedule) => ({
          ...schedule,
          dia: SPANISH_TO_ENGLISH_DAY_MAP[schedule.dia] || schedule.dia, // Convierte si es español, mantiene si ya es inglés o desconocido
        }))
        console.log("NewAppointmentStepper: Horarios de la clínica normalizados (English):", normalizedHours)
        setClinicWorkHours(normalizedHours)
        if (normalizedHours.length > 0 && normalizedHours[0].duracion_sesion) {
          setAppointmentDuration(normalizedHours[0].duracion_sesion)
        } else {
          setAppointmentDuration(60)
          console.warn(
            "NewAppointmentStepper: No se encontró 'duracion_sesion' en los horarios, usando 60 minutos por defecto.",
          )
        }
      } catch (err) {
        console.error("NewAppointmentStepper: Error al cargar horarios de la clínica:", err)
        toast.error("No se pudieron cargar los horarios de la clínica.")
        setAppointmentDuration(60)
      } finally {
        setConfigLoading(false)
      }
    }
    loadClinicData()
  }, [])

  useEffect(() => {
    if (perfil) {
      setFormData((prev) => ({
        ...prev,
        nombre_paciente: perfil.nombre_completo || "",
        sexo: perfil.sexo || "",
        telefono: perfil.telefono || "",
        email: perfil.email || "",
      }))
    }
  }, [perfil])

  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    console.log("NewAppointmentStepper: Paso actual del hook useAgendarCita:", paso)
    if (citaCreada && paso === 4) {
      setCurrentStep(6)
    } else {
      setCurrentStep(paso)
    }
  }, [paso, citaCreada])

  useEffect(() => {
    if (hookError) {
      toast.error(hookError)
    }
  }, [hookError])

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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
      if (!fecha_cita || !hora_cita || !motivo_consulta) {
        toast.error("Por favor, complete la fecha, hora y motivo de la cita.")
        return
      }
      if (appointmentDuration === null) {
        toast.error("La duración de la cita no está configurada. Por favor, intente de nuevo más tarde.")
        return
      }
      const combinedDateTime = `${fecha_cita}T${hora_cita}:00`
      console.log("NewAppointmentStepper: Validando disponibilidad para:", combinedDateTime)
      if (!isTimeSlotAvailable(combinedDateTime, appointmentDuration, citas, clinicWorkHours)) {
        return
      }
      setCurrentStep(4)
    } else if (currentStep === 4) {
      if (!formData.metodo_pago) {
        toast.error("Por favor, seleccione un método de pago.")
        return
      }
      setCurrentStep(5)
    } else if (currentStep === 5) {
      setCurrentStep(6)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmitAppointment = async () => {
    const combinedDateTime = `${formData.fecha_cita}T${formData.hora_cita}:00`
    const citaFormData = new FormData()
    citaFormData.append("id_usuario", userId)
    citaFormData.append("fecha_hora", new Date(combinedDateTime).toISOString())
    citaFormData.append(
      "notes",
      `Motivo: ${formData.motivo_consulta || "N/A"} | Alergias: ${formData.alergias || "Ninguna"}`,
    )
    citaFormData.append("estado", formData.estado)
    citaFormData.append("duracion", appointmentDuration.toString())
    citaFormData.append("metodo_pago", formData.metodo_pago)
    // Asegúrate de que la descripción de la radiografía también se envíe si es necesaria en el backend
    if (formData.radiografia_descripcion) {
      citaFormData.append("foto_documento_descripcion", formData.radiografia_descripcion)
    }
    // CAMBIO CLAVE AQUÍ: Iterar sobre el array de archivos y adjuntar cada uno individualmente
    if (formData.radiografias && formData.radiografias.length > 0) {
      formData.radiografias.forEach((file) => {
        citaFormData.append("radiografias", file)
      })
    }

    await agendarCita(citaFormData)
  }

  const isTimeSlotAvailable = (dateTime, duration, existingAppointments, clinicWorkHoursData) => {
    const newAppStartTime = new Date(dateTime).getTime()
    const newAppEndTime = newAppStartTime + Number.parseInt(duration) * 60 * 1000
    const selectedDayIndex = new Date(dateTime).getDay()
    const selectedDayNameEnglish = ENGLISH_DAYS_OF_WEEK[selectedDayIndex]

    console.log("NewAppointmentStepper: Día seleccionado (inglés):", selectedDayNameEnglish)

    const daySchedules = clinicWorkHoursData.filter((schedule) => schedule.dia === selectedDayNameEnglish)
    console.log("NewAppointmentStepper: Horarios filtrados para el día:", daySchedules)

    if (daySchedules.length === 0) {
      toast.error(`La clínica no trabaja los ${selectedDayNameEnglish}s.`)
      return false
    }

    let isWithinWorkHours = false
    for (const schedule of daySchedules) {
      const workStartTimeParts = schedule.hora_inicio.split(":")
      const workEndTimeParts = schedule.hora_fin.split(":")
      const workStartDateTime = new Date(dateTime)
      workStartDateTime.setHours(Number.parseInt(workStartTimeParts[0]), Number.parseInt(workStartTimeParts[1]), 0, 0)
      const workEndDateTime = new Date(dateTime)
      workEndDateTime.setHours(Number.parseInt(workEndTimeParts[0]), Number.parseInt(workEndTimeParts[1]), 0, 0)

      if (newAppStartTime >= workStartDateTime.getTime() && newAppEndTime <= workEndDateTime.getTime()) {
        isWithinWorkHours = true
        break
      }
    }

    if (!isWithinWorkHours) {
      toast.error("El horario seleccionado está fuera del horario laboral de la clínica para este día.")
      return false
    }

    for (const app of existingAppointments) {
      if (app.estado === "cancelada" || app.estado === "completada") continue
      const existingAppStartTime = new Date(app.fecha_cita).getTime()
      const existingAppDuration = app.duracion || duration
      const existingAppEndTime = existingAppStartTime + existingAppDuration * 60 * 1000

      if (newAppStartTime < existingAppEndTime && newAppEndTime > existingAppStartTime) {
        toast.error("El horario seleccionado se superpone con otra cita existente.")
        return false
      }
    }
    return true
  }

  const stepTitles = [
    "Términos y Condiciones",
    "Datos del Cliente",
    "Detalles de la Cita y Salud",
    "Opciones de Pago",
    "Resumen de la Cita",
    "Confirmación Final",
  ]

  if (configLoading || appointmentDuration === null) {
    return (
      <div className="publicAppointment-stepper-outer-wrapper">
        <div className="newAppointment-stepper-layout">
          <div className="newAppointment-stepper-content-area">
            <p>Cargando configuración de la clínica...</p>
          </div>
        </div>
      </div>
    )
  }

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
            clinicWorkHours={clinicWorkHours} // Ahora con días en inglés
            existingAppointments={citas}
            appointmentDuration={appointmentDuration}
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
            onNext={handleNextStep}
            onSubmit={handleSubmitAppointment}
            formData={formData}
            loading={hookLoading || citasLoading}
          />
        )
      case 6:
        return <ConfirmationStep loading={hookLoading || citasLoading} />
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

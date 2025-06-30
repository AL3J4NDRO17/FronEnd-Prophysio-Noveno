"use client"

import { useState, useEffect, useCallback } from "react"
import { clinicHoursService } from "../services/clinicHoursService"
import { toast } from "react-toastify"

// Mapeo de días de la semana de español a inglés
const DAY_MAP = {
  Lunes: "Monday",
  Martes: "Tuesday",
  Miércoles: "Wednesday",
  Jueves: "Thursday",
  Viernes: "Friday",
  Sábado: "Saturday",
  Domingo: "Sunday",
}

export const useClinicHours = () => {
  const [clinicHours, setClinicHours] = useState(null) // Almacenará los horarios en un formato mapeado
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchClinicHours = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await clinicHoursService.getClinicHours()

      // Transformar los datos para un uso más fácil en el frontend
      const transformedHours = data.reduce((acc, curr) => {
        const englishDay = DAY_MAP[curr.dia]
        if (englishDay) {
          if (!acc[englishDay]) {
            acc[englishDay] = []
          }
          acc[englishDay].push({
            hora_inicio: curr.hora_inicio,
            hora_fin: curr.hora_fin,
          })
        }
        return acc
      }, {})
      setClinicHours(transformedHours)
    } catch (err) {
      console.error("Error al cargar horarios de clínica:", err)
      toast.error("No se pudieron cargar los horarios de la clínica.")
      setError(err.message || "Error al cargar horarios de clínica")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClinicHours()
  }, [fetchClinicHours])

  return { clinicHours, loading, error }
}

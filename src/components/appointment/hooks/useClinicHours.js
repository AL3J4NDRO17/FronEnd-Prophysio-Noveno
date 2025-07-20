"use client"

import { useState, useEffect, useCallback } from "react"
import { horarioService} from "../services/clinicHoursService"
import { toast } from "react-toastify"

export const useClinicHours = () => {
  const [clinicHours, setClinicHours] = useState([]) // Ahora almacenará un array de objetos de horario
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchClinicHours = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await horarioService.getClinicHours()
      // No necesitamos transformar los días a inglés aquí, ya que el backend los envía en español
      // y el frontend los mapea a inglés cuando es necesario para date-fns.
      // Simplemente almacenamos los datos tal cual vienen del backend,
      // asegurando que hora_comida_inicio y hora_comida_fin estén presentes (o null).
      const processedData = data.map((h) => ({
        ...h,
        hora_comida_inicio: h.hora_comida_inicio || null,
        hora_comida_fin: h.hora_comida_fin || null,
      }))
      setClinicHours(processedData)
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

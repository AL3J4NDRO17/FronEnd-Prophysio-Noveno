"use client"

import { useState, useEffect, useCallback } from "react"
import { getLogsByDate } from "../services/getLogsService"
import { toast } from "react-toastify"

const useLogs = (initialDate = new Date().toISOString().split("T")[0]) => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentDate, setCurrentDate] = useState(initialDate)

  const fetchLogs = useCallback(async (dateToFetch) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getLogsByDate(dateToFetch)
      setLogs(data)
 
    } catch (err) {
      setError(err.message)
      setLogs([]) // Limpiar logs en caso de error
      toast.error(`Error al cargar los logs para el ${dateToFetch}.`)
      console.error("Error fetching logs:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs(currentDate)
  }, [currentDate, fetchLogs])

  const setDate = (newDate) => {
    setCurrentDate(newDate)
  }

  return { logs, loading, error, setDate, currentDate, fetchLogs }
}

export default useLogs

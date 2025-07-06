export const getLogsByDate = async (date) => {
  const backendApiUrl = "http://localhost:5000/api" // o process.env.REACT_APP_BACKEND_API_URL si usas CRA

  if (!backendApiUrl) {
    console.error("❌ BACKEND_API_URL no está configurada.")
    throw new Error("Error de configuración del servidor.")
  }

  try {
    const response = await fetch(`${backendApiUrl}/logs/getLogs/:${date}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Error desconocido del backend." }))
      console.error("❌ Error del backend:", errorData)
      throw new Error(errorData.message || "Error al obtener logs.")
    }

    const logs = await response.json()
    return logs
  } catch (error) {
    console.error("❌ Error al obtener logs:", error)
    throw new Error("Error interno del servidor al obtener logs.")
  }
}

"use client"

import { useState, useEffect } from "react"
import { getallCompanies, createCompany, updateDataCompany } from "../services/companyService"
import Swal from "sweetalert2"
import { toast } from "react-toastify"

const useCompany = () => {
    const [company, setCompany] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)

    const fetchOrCreateCompany = async () => {
        setLoading(true)
        try {
            const response = await getallCompanies()

            if (Array.isArray(response) && response.length > 0) {
                setCompany(response[0])
                toast.success("Empresa cargada correctamente")
            } else {
                Swal.fire({
                    title: "No hay datos de la empresa registrados",
                    text: "Se crearán nuevos campos con datos predeterminados.",
                    icon: "info",
                    confirmButtonText: "OK",
                })

                const newCompany = await createCompany({
                    name: "Nueva Empresa",
                    email: "",
                    phone: "",
                    address: "",
                    mission: "",
                    vision: "",
                })

                toast.success("Empresa creada exitosamente")
                setCompany(newCompany)
            }

            setError(null)
        } catch (err) {
            toast.error("Error al manejar la empresa")
            setError(err.message || "Error al manejar la empresa")
        } finally {
            setLoading(false)
        }
    }

    // Función para actualizar la empresa con confirmación
    const updateCompany = async (updatedData) => {
        const confirmResult = await Swal.fire({
            title: "¿Desea actualizar la empresa?",
            text: "Esta acción modificará la información actual.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, actualizar",
            cancelButtonText: "Cancelar",
        })

        if (!confirmResult.isConfirmed) {
            return
        }

        setIsUpdating(true)
        try {
            const updatedCompany = await updateDataCompany(updatedData.company_id, updatedData)
            setCompany(updatedCompany)
            toast.success("Empresa actualizada correctamente")
            return updatedCompany
        } catch (err) {
            toast.error("Error al actualizar la empresa")
            setError(err.message || "Error al actualizar la empresa")
            throw err
        } finally {
            setIsUpdating(false)
        }
    }

    useEffect(() => {
        fetchOrCreateCompany()
    }, []) // 👈 Verifica que solo se ejecute una vez

    return {
        company,
        loading,
        error,
        updateCompany,
        isUpdating
    }
}

export default useCompany

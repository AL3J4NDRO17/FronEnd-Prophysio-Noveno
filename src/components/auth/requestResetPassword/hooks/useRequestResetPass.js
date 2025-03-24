"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import {
    solicitarCodigoRecuperacion,
    restablecerPasswordConCodigo,
    verificarPreguntaSecreta,
    solicitarPreguntaSecreta,
    verificarCodigoRecuperacion
} from "../services/requestResetPassService"

export const usePasswordRecovery = () => {
    const [loading, setLoading] = useState(false)

    // 🔹 1️⃣ Solicitar código por correo
    const handleSolicitarCodigo = async (email) => {
        try {
            setLoading(true)
            await solicitarCodigoRecuperacion(email)
            toast.success("Código enviado a tu correo 📩")
            return true
        } catch (error) {
            toast.info(error.response?.data?.error || "Error al enviar el código")
            return false
        } finally {
            setLoading(false)
        }
    }
    const handleSolicitarPreguntaSecreta = async (email) => {
        try {
            setLoading(true)
            const response = await solicitarPreguntaSecreta(email)
            toast.success("Introduzca su respuesta a la pregunta secreta")
            return response
        } catch (error) {
            toast.info(error.response?.data?.error || "Error al enviar el código")
            return false
        } finally {
            setLoading(false)
        }
    }

    // 🔹 2️⃣ Verificar pregunta secreta y enviar código
    const handleVerificarPregunta = async (email, respuesta) => {
        try {
            setLoading(true)
            await verificarPreguntaSecreta(email, respuesta)
            toast.success("Código enviado tras responder la pregunta correctamente ✅")
            return true
        } catch (error) {
            toast.info(error.response?.data?.error || "Error al enviar el código")
            return false
        } finally {
            setLoading(false)
        }
    }
    const handleVerificarCode = async (email,code) => {
        try {
            setLoading(true)
            await verificarCodigoRecuperacion(email,code)
            toast.success("Codigo verificado✅")
            return true
        } catch (error) {
            toast.info(error.response?.data?.error || "Error al enviar el código")
            return false
        } finally {
            setLoading(false)
        }
    }
    // 🔹 3️⃣ Restablecer contraseña con código OTP
    const handleRestablecerPassword = async (email, code, nuevaPassword) => {
        try {
            setLoading(true)
            await restablecerPasswordConCodigo(email, code, nuevaPassword)
            toast.success("Éxito", "Contraseña actualizada correctamente 🔐", "success")
            return true
        } catch (error) {
            toast.info(error.response?.data?.error || "Error al reestablecer la contraseña")
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        handleSolicitarCodigo,
        handleVerificarPregunta,
        handleRestablecerPassword,
        handleSolicitarPreguntaSecreta,
        handleVerificarCode
    }
}


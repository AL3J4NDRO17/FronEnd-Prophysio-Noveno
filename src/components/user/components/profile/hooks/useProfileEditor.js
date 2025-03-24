import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import perfilUsuarioService from "../services/profileEditorService"

const usePerfilUsuario = (id) => {
    const [perfil, setPerfil] = useState(null)

    const [loading, setLoading] = useState(false)

    // Obtener todos los perfiles
    const fetchPerfil = async (id) => {
        try {
            setLoading(true)
            console.log(id)
         
            const res = await perfilUsuarioService.getById(id)

            setPerfil(res.data)
            
        } catch (err) {
            toast.error("Error al cargar los perfiles 😓")
        } finally {
            setLoading(false)
            
        }
    }

    // Crear nuevo perfil
 

    // Actualizar perfil
    const actualizarPerfil = async (id, data) => {
        console.log("actualizarPerfil", id, data)
        try {
            await perfilUsuarioService.update(id, data)
            toast.success("Perfil actualizado 💾");
            return true;
            
        } catch (err) {
            toast.error("No se pudo actualizar el perfil 😬")
        }
    }

    // Eliminar perfil
    const eliminarPerfil = async (id) => {
        try {
            await perfilUsuarioService.remove(id)
            setPerfil((prev) => prev.filter((p) => p.id_perfil !== id))
            toast.success("Perfil eliminado 🗑️")
        } catch (err) {
            toast.error("Error al eliminar el perfil 😵")
        }
    }

    useEffect(() => {
        fetchPerfil(id)
    }, [id])

    return {
        perfiles: perfil,
        loading,
        fetchPerfil,
       
        actualizarPerfil,
        eliminarPerfil,
    }
}

export default usePerfilUsuario

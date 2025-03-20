import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    getAllTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateTestimonialStatus,
    getTestimonialStats,
} from "../services/testimonialService";

const useTestimonials = () => {
    const queryClient = useQueryClient();

    // Obtener todos los testimonios
    const { data: testimonios, isLoading: loading } = useQuery({
        queryKey: ["testimonios"],
        queryFn: getAllTestimonials,
        staleTime: 1000 * 60 * 5, // 5 minutos de caché
    });

    // Obtener estadísticas de testimonios
    const { data: testimonialStats } = useQuery({
        queryKey: ["testimonialStats"],
        queryFn: getTestimonialStats,
        staleTime: 1000 * 60 * 10, // 10 minutos de caché
    });

    // Obtener un testimonio por ID
    const fetchTestimonioById = async (id) => {
        try {
            return await getTestimonialById(id);
        } catch (error) {
            toast.error(`Error al obtener el testimonio con ID ${id} 😢`);
            return null;
        }
    };

    // Crear testimonio
    const createMutation = useMutation({
        mutationFn: createTestimonial,
        onSuccess: (nuevoTestimonio) => {
            queryClient.invalidateQueries(["testimonios"]);
            toast.success("Testimonio creado con éxito 🎉");
        },
        onError: () => {
            Swal.fire("Error", "No se pudo crear el testimonio 😞", "error");
        },
    });

    // Actualizar testimonio
    const updateMutation = useMutation({
        mutationFn: ({ id, testimonioData }) => updateTestimonial(id, testimonioData),
        onSuccess: () => {
            queryClient.invalidateQueries(["testimonios"]);
            toast.success("Testimonio actualizado ✅");
        },
        onError: () => {
            Swal.fire("Error", "No se pudo actualizar el testimonio 😞", "error");
        },
    });

    // Eliminar testimonio con confirmación
    const deleteMutation = useMutation({
        mutationFn: deleteTestimonial,
        onSuccess: () => {
            queryClient.invalidateQueries(["testimonios"]);
            toast.success("Testimonio eliminado 🚮");
        },
        onError: () => {
            Swal.fire("Error", "No se pudo eliminar el testimonio 😞", "error");
        },
    });

    const handleDeleteTestimonio = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            deleteMutation.mutate(id);
        }
    };

    // Actualizar estado del testimonio
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => updateTestimonialStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(["testimonios"]);
            toast.success("Estado del testimonio actualizado");
        },
        onError: () => {
            Swal.fire("Error", "No se pudo actualizar el estado 😞", "error");
        },
    });

    return {
        testimonios,
        loading,
        testimonialStats,
        fetchTestimonioById,
        createMutation,
        updateMutation,
        deleteMutation,
        updateStatusMutation,
        handleDeleteTestimonio,
    };
};

export default useTestimonials;

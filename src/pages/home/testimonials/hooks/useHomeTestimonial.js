import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    getAllTestimonials,

} from "../services/testimonialServices";

const useTestimonials = () => {


    // Obtener todos los testimonios
    const { data: testimonios, isLoading: loading } = useQuery({
        queryKey: ["testimonios"],
        queryFn: getAllTestimonials,
        staleTime: 1000 * 60 * 5, // 5 minutos de caché
    });


    return {
        testimonios,
        loading,

    };
};

export default useTestimonials;

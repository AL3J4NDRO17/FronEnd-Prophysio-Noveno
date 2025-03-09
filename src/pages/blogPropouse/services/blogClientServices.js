import axiosInstance from "../../../components/api/axiosConfig";
const PUBLIC_URL = 'public';  // Asegúrate de que esta URL esté bien configurada


export const fetchBlogs = async () => {
    const { data } = await axiosInstance.get(`${PUBLIC_URL}/list`);
    return data;
};

export const getCategories = async () => {

    const { data } = await axiosInstance.get(`${PUBLIC_URL}/getAllCategoria`);

    return data;
};

export const fetchBlogById = async (id) => {
    const { data } = await axiosInstance.get(`${PUBLIC_URL}/getBlogById/${id}`);  // URL para obtener el detalle de un blog
    return data;
};
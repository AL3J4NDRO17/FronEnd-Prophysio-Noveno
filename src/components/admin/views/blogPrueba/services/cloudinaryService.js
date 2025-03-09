import axios from 'axios';

export const uploadImageToCloudinary = async (file, width, height) => {
    const formData = new FormData();
    formData.append("file", file); // El archivo que estás subiendo
    formData.append("upload_preset", "Prophysio"); // Tu upload preset en Cloudinary
    formData.append("fetch_format", "webp"); // Convertir a WebP (opcional)
  
    try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dfckdtzwu/upload", // Tu Cloud name en Cloudinary
            formData
        );

        // Obtén las dimensiones de la imagen
        const { width: imgWidth, height: imgHeight } = response.data;

        // Retorna la URL de la imagen y sus dimensiones
        return { url: response.data.secure_url, width: imgWidth, height: imgHeight };
    } catch (error) {
        console.error("Error al subir la imagen a Cloudinary:", error.response ? error.response.data : error.message);
        throw new Error("Error al subir la imagen a Cloudinary");
    }
};

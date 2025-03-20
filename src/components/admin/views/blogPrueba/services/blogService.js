import axiosInstance from "@/components/api/axiosConfig";


export const fetchBlogs = async () => {
  const { data } = await axiosInstance.get("/blog/list");
  return data;
};

export const createBlogService = async (newBlog) => {
  const formData = new FormData();

  // Convertimos los datos del blog en FormData
  formData.append('title', newBlog.title);
  formData.append('mainContent', newBlog.mainContent);
  formData.append('effectsTitle', newBlog.effectsTitle);
  formData.append('effectsContent', newBlog.effectsContent);
  formData.append('author', newBlog.author);
  formData.append('categoryId', newBlog.categoryId);
  formData.append('bannerTitle', newBlog.bannerTitle);
  formData.append('textStyle', JSON.stringify(newBlog.textStyle));

  if (newBlog.bannerImage) {
    formData.append('bannerImage', newBlog.bannerImage);
  }

  if (newBlog.contentImage) {
    formData.append('contentImage', newBlog.contentImage);
  }
  console.log(newBlog.contentImageSize)
  console.log(JSON.stringify(newBlog.contentImageSize))
  if (newBlog.contentImageSize) {
    // Añadimos las dimensiones de la imagen de contenido
    formData.append('contentImageSize', JSON.stringify(newBlog.contentImageSize)); // Lo enviamos como JSON
  }
  console.log(formData)
  const { data } = await axiosInstance.post("/blog/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Especificamos que estamos enviando archivos
    },
  });

  return data;
};


export const deleteBlogService = async (id) => {
  await axiosInstance.delete(`/blog/delete/${id}`);
};

export const updateBlogService = async (id, updatedBlog) => {
  const { data } = await axiosInstance.put(`/blog/update/${id}`, updatedBlog);
  return data;
};

// Función para actualizar el estado de un blog
export const updateStatusBlogService = async (id, updatedData) => {
  const { data } = await axiosInstance.put(`/blog/updateStatus/${id}`, updatedData); // Asegúrate de que esta ruta esté bien configurada
  return data;
};

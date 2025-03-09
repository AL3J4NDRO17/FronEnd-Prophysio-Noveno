import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBlogService, updateBlogService } from "../services/blogService";
import { toast } from "react-toastify";
import { uploadImageToCloudinary } from "../services/cloudinaryService";

export function useBlogEditor(existingBlog, onClose, contentImageSize) {
  const queryClient = useQueryClient();
  
  const [blogData, setBlogData] = useState({
    bannerTitle: existingBlog?.bannerTitle || '',
    bannerImage: existingBlog?.bannerImage || null,
    title: existingBlog?.title || '',
    mainContent: existingBlog?.mainContent || '',
    effectsTitle: existingBlog?.effectsTitle || '',
    effectsContent: existingBlog?.effectsContent || '',
    author: existingBlog?.author || '',
    categoryId: existingBlog?.categoryId || '',
    contentImage: existingBlog?.contentImage || null,
    textStyle: existingBlog?.textStyle || {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#000000',
      textAlign: 'left',
    },
    status: existingBlog?.status || "draft",
    contentimagedimensions: existingBlog?.contentimagedimensions 
  });

  useEffect(() => {
    if (existingBlog) {
      setBlogData({
        bannerTitle: existingBlog.bannerTitle || '',
        bannerImage: existingBlog.bannerImage || null,
        title: existingBlog.title || '',
        mainContent: existingBlog.mainContent || '',
        effectsTitle: existingBlog.effectsTitle || '',
        effectsContent: existingBlog.effectsContent || '',
        author: existingBlog.author || '',
        categoryId: existingBlog.categoryId || '',
        contentImage: existingBlog.contentImage || null,
        textStyle: existingBlog.textStyle || {
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          color: '#000000',
          textAlign: 'left',
        },
        status: existingBlog.status || "draft",
        contentimagedimensions: existingBlog?.contentimagedimensions || ''
      });
    }
  }, [existingBlog]);

  const isEditing = Boolean(existingBlog);

  const mutation = useMutation({
    mutationFn: isEditing
      ? (updatedBlog) => updateBlogService(existingBlog.id, updatedBlog)
      : createBlogService,
    onSuccess: () => {
      toast.success(isEditing ? "Blog actualizado" : "Blog creado");
      queryClient.invalidateQueries(["blogs"]);
      onClose();
    },
    onError: (error) => {
      toast.error(`Error al guardar el blog: ${error.message}`);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStyleChange = (property, value) => {
    setBlogData(prev => ({
      ...prev,
      textStyle: {
        ...prev.textStyle,
        [property]: value
      }
    }));
  };


  const handlePublish = async () => {
    // Validación
    if (!blogData.title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (!blogData.mainContent.trim() || !blogData.effectsContent.trim()) {
      toast.error("El contenido no puede estar vacío");
      return;
    }

    let bannerImageUrl = blogData.bannerImage;
    let contentImageUrl = blogData.contentImage;

    // Subir imagen del banner
    if (bannerImageUrl && bannerImageUrl instanceof File) {
      try {
        bannerImageUrl = await uploadImageToCloudinary(bannerImageUrl);
      } catch (error) {
        toast.error("Error al subir la imagen del banner");
        return;
      }
    }
    // Subir imagen de contenido con el tamaño ajustado
    if (contentImageUrl && contentImageUrl instanceof File) {
      try {
        console.log()
        const response = await uploadImageToCloudinary(
          contentImageUrl,
          contentImageSize.width,  // Usamos el tamaño ajustado aquí
          contentImageSize.height  // Usamos el tamaño ajustado aquí
        );
        contentImageUrl = response.url;
        contentImageSize = { width: response.width, height: response.height }; // Obtener las dimensiones
      } catch (error) {
        toast.error("Error al subir la imagen de contenido");
        return;
      }
    }
    console.log(bannerImageUrl.url)
    // Preparar datos para enviar al backend
    const blogToSend = {
      ...blogData,
      bannerImage: bannerImageUrl.url,
      contentImage: contentImageUrl,
      contentImageSize, // Incluye las dimensiones de la imagen
    };


    mutation.mutate(blogToSend);
  };


  return {
    blogData,
    setBlogData,
    handleInputChange,
    handleStyleChange,
    handlePublish,

    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
  };
}

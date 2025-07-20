import axiosInstance from "@/components/api/axiosConfig"

export const fetchBlogs = async () => {
  const { data } = await axiosInstance.get("/blog/list")
  return data
}

export const createBlogService = async (newBlog) => {
  const formData = new FormData()

  formData.append("title", newBlog.title)
  formData.append("mainContent", newBlog.mainContent)
  formData.append("author", newBlog.author)
  formData.append("categoryId", newBlog.categoryId)
  formData.append("status", newBlog.status || "draft")

  if (newBlog.bannerImage instanceof File) {
    // Ensure it's a File
    formData.append("bannerImage", newBlog.bannerImage)
  }
  // If bannerImage is a URL string for a new blog, it's an issue.
  // The frontend `handlePublish` in `useBlogEditor` should ensure `bannerImage` is a File for new blogs.

  if (newBlog.contentImage instanceof File) {
    // Added, ensure it's a File
    formData.append("contentImage", newBlog.contentImage)
  }

  // Adjuntas múltiples
  if (newBlog.attachedImages && newBlog.attachedImages.length > 0) {
    newBlog.attachedImages.forEach((item) => {
      // Iterate over items (File or URL)
      if (item instanceof File) {
        formData.append("attachedImages", item) // Append File objects
      }
      // For create, we don't send attachedImageUrl. Backend createBlog only expects files.
    })
  }

  const { data } = await axiosInstance.post("/blog/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return data
}

export const deleteBlogService = async (id) => {
  await axiosInstance.delete(`/blog/delete/${id}`)
}

export const updateBlogService = async (id, updatedBlog) => {
  const formData = new FormData() // Must use FormData for updates with files

  // Append all text fields
  formData.append("title", updatedBlog.title)
  formData.append("mainContent", updatedBlog.mainContent)
  formData.append("author", updatedBlog.author)
  formData.append("categoryId", updatedBlog.categoryId)
  formData.append("status", updatedBlog.status || "draft")

  // Banner image handling for update
  if (updatedBlog.bannerImage instanceof File) {
    formData.append("bannerImage", updatedBlog.bannerImage) // New file
  } else if (typeof updatedBlog.bannerImage === "string") {
    formData.append("bannerImageUrl", updatedBlog.bannerImage) // Existing URL
  } else if (updatedBlog.bannerImage === null) {
    formData.append("bannerImageRemoved", "true") // Indicate removal if null
  }

  // Attached images handling for update
  if (updatedBlog.attachedImages && updatedBlog.attachedImages.length > 0) {
    updatedBlog.attachedImages.forEach((item) => {
      if (item instanceof File) {
        formData.append("attachedImages", item) // New files
      } else if (typeof item === "string") {
        formData.append("attachedImageUrl", item) // Existing URLs
      }
    })
  } else if (updatedBlog.attachedImages && updatedBlog.attachedImages.length === 0) {
    formData.append("attachedImagesRemoved", "true") // Indicate all attached images removed
  }

  const { data } = await axiosInstance.put(`/blog/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}

// Función para actualizar el estado de un blog
export const updateStatusBlogService = async (id, updatedData) => {
  const { data } = await axiosInstance.put(`/blog/updateStatus/${id}`, updatedData) // Asegúrate de que esta ruta esté bien configurada
  return data
}

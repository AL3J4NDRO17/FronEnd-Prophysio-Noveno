"use client"

import { useState } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"

import BlogBanner from "./components/banner"
import BlogMeta from "./components/meta"
import BlogContent from "./components/content"
import BlogRelated from "./components/related"

import { useBlog } from "./hooks/useBlogs"
import { useRelatedBlogs } from "./hooks/useRelatedBlogs"
import { useCategories } from "./hooks/useClientCategories"

import "./styles/banner.css"
import "./styles/blogDetail.css"
import "./styles/content.css"
import "./styles/meta.css"
import "./styles/related.css"


export default function BlogDetail() {
    const [showShareOptions, setShowShareOptions] = useState(false)
    const [liked, setLiked] = useState(false)
    const { id } = useParams()

    // Obtener datos del blog
    const { blog, isLoading, error } = useBlog(id)

    // Obtener categorías
    const { categories } = useCategories()

    // Obtener blogs relacionados
    const { relatedBlogs } = useRelatedBlogs(id, blog?.categoryId)

    // Función para compartir en redes sociales
    const handleShare = (platform) => {
        const url = window.location.href
        const title = blog?.title

        let shareUrl = ""

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                break
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
                break
            case "linkedin":
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
                break
            case "email":
                shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
                break
            default:
                break
        }

        if (shareUrl) {
            window.open(shareUrl, "_blank")
        }
    }

    // Función para dar like
    const handleLike = () => {
        setLiked(!liked)
        // Aquí se podría implementar la lógica para guardar el like en la base de datos
    }

    // Obtener el nombre de la categoría
    const getCategoryName = (categoryId) => {
        if (!categories || !categoryId) return null
        const category = categories.find((cat) => cat.id === Number(categoryId))
        return category ? category.nombre : null
    }

    if (isLoading) {
        return (
            <div className="publicBlogDetail-loading">
                <div className="publicBlogDetail-loading-spinner"></div>
                <p>Cargando artículo...</p>
            </div>
        )
    }

    if (error || !blog) {
        return (
            <div className="publicBlogDetail-error">
                <h2>No se pudo cargar el artículo</h2>
                <p>{error?.message || "El artículo solicitado no existe o no está disponible."}</p>
                <Link href="/blog" className="publicBlogDetail-primary-button">
                    <ChevronLeft className="publicBlogDetail-button-icon" />
                    Volver al blog
                </Link>
            </div>
        )
    }

    const categoryName = getCategoryName(blog.categoryId)

    return (
        <div className="publicBlogDetail-container">
            <div className="publicContainer">
                <div>
                    <BlogBanner blog={blog} />

                    <BlogMeta
                        blog={blog}
                        categoryName={categoryName}
                        liked={liked}
                        handleLike={handleLike}
                        showShareOptions={showShareOptions}
                        setShowShareOptions={setShowShareOptions}
                        handleShare={handleShare}
                    />

                    <div className="publicBlogDetail-layout">
                        <div className="publicBlogDetail-main">
                            <BlogContent blog={blog} />
                        </div>

                    </div>
                </div>
                <div>
                    {relatedBlogs && relatedBlogs.length > 0 && (
                        <div className="publicBlogDetail-sidebar">
                            <BlogRelated relatedBlogs={relatedBlogs} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

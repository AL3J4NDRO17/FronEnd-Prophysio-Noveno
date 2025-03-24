import "./blog.css"
import IMG from "./resources/physiotherapy-concept-illustration-b.webp"
import SlideInRight from "../../../utils/animations/SlideRight"
import SlideInLeft from "../../../utils/animations/SlideLeft"
import { useBlogs } from "./hooks/useHomeBlogs"
import { Link } from "react-router-dom"

function stripHtmlTags(str) {
    if (!str) return ""
    return str.replace(/<[^>]*>/g, "")
}

function formatDate(dateString) {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

const BlogSection = () => {
    const { blogs, isLoading, error } = useBlogs()

    // Mostrar solo los 4 blogs más recientes
    const recentBlogs = blogs?.slice(0, 3) || []

    return (

        <div className="blog-home-section-container">
            <section className="blog-section">
                <SlideInLeft>
                    <div className="blog-data-container">
                        <div className="blog-container">
                            {isLoading ? (
                                <p>Cargando artículos...</p>
                            ) : error ? (
                                <p>No pudimos cargar los artículos: {error}</p>
                            ) : (
                                <div className="blog-grid">
                                    {recentBlogs.map((post) => (
                                        <article key={post.id} className="blog-card">
                                            <Link to={`/blog/${post.id}`}>
                                                <img
                                                    src={post.bannerImage || "/placeholder.svg?height=180&width=320"}
                                                    alt={post.title}
                                                    className="blog-image"
                                                />
                                                <div className="blog-content">
                                                    <div className="blog-category">{post.category || "Fisioterapia"}</div>
                                                    <h3 className="blog-card-title">{post.title}</h3>
                                                    <p className="blog-excerpt">
                                                        {stripHtmlTags(post.mainContent || post.effectsContent).substring(0, 300)}...
                                                    </p>
                                                    <div className="blog-metadata">
                                                        <span>{formatDate(post.publishDate || post.date)}</span>
                                                        <span>• Por {post.author || "ProPhysio"}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </article>
                                    ))}
                                </div>
                            )}


                        </div>
                    </div>
                </SlideInLeft>

                <SlideInRight>
                    <div className="blog-img-container">
                        <img
                            src={IMG || "/placeholder.svg"}
                            alt="ProPhysio fisioterapia"
                            className="blog-img-icon"
                            width="1000"
                            height="400"
                            loading="lazy"
                        />
                    </div>
                </SlideInRight>

            </section>
            <div className="blog-view-all">
                <Link to="/blog" className="view-all-button">
                    Ver todos los artículos
                </Link>
            </div >
        </div>
    )
}

export default BlogSection


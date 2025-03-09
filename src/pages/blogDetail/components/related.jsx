import { Link } from "react-router-dom"


export default function BlogRelated({ relatedBlogs }) {
  return (
    <div className="publicBlogDetail-related">
      <h2 className="publicBlogDetail-related-title">Artículos relacionados</h2>
      <div className="publicBlogDetail-related-grid">
        {relatedBlogs.map((relatedBlog) => (
          <Link to={`/blog/${relatedBlog.id}`} key={relatedBlog.id} className="publicBlogDetail-related-card">
            <div className="publicBlogDetail-related-image">
              {relatedBlog.bannerImage ? (
                <img src={relatedBlog.bannerImage || "/placeholder.svg"} alt={relatedBlog.title} />
              ) : (
                <div className="publicBlogDetail-related-image-placeholder"></div>
              )}
            </div>
            <div className="publicBlogDetail-related-content">
              <h3 className="publicBlogDetail-related-card-title">{relatedBlog.title}</h3>
              <p className="publicBlogDetail-related-card-meta">
                {new Date(relatedBlog.publishDate || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


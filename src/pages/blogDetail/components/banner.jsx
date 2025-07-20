import { ImageIcon } from "lucide-react"

export default function BlogBanner({ blog }) {
  return (
    <div className="publicBlogDetail-banner">
      {blog.bannerImage ? (
        <img
          src={blog.bannerImage || "/placeholder.svg"}
          alt={blog.title}
          className="publicBlogDetail-banner-image"
        />
      ) : (
        <div className="publicBlogDetail-banner-placeholder">
          <ImageIcon className="publicBlogDetail-icon-large" />
        </div>
      )}
      <h1 className="publicBlogDetail-banner-title ql-editor">
        {blog.title && <div dangerouslySetInnerHTML={{ __html: blog.title }} />}
      </h1>
    </div>
  )
}

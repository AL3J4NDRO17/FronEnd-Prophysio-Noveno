import { ImageIcon } from "lucide-react"

export default function BlogBanner({ blog }) {
  return (
    <div className="publicBlogDetail-banner">
      {blog.bannerImage ? (
        <img
          src={blog.bannerImage || "/placeholder.svg"}
          alt={blog.bannerTitle}
          className="publicBlogDetail-banner-image"
        />
      ) : (
        <div className="publicBlogDetail-banner-placeholder">
          <ImageIcon className="publicBlogDetail-icon-large" />
        </div>
      )}
      <h1 className="publicBlogDetail-banner-title ql-editor">
        {blog.bannerTitle && <div dangerouslySetInnerHTML={{ __html: blog.bannerTitle }} />}
      </h1>
    </div>
  )
}

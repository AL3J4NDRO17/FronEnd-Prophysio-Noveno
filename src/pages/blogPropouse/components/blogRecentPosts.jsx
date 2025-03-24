import "../styles/blogRecentPosts.css";
import { useBlogs } from "../hooks/useClientBlog";
import { useNavigate } from "react-router-dom";

export default function BlogRecentPosts() {
  const { blogs, isLoading, error } = useBlogs();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Cargando posts recientes...</div>;
  }

  if (error) {
    return <div>Error al cargar posts recientes.</div>;
  }

  const recentPosts = blogs
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  if (!recentPosts) {
    return <div>No hay post recientes para mostrar...</div>;
  }
  return (
    <section className="blog-recent-posts">
      <h2 className="recent-posts-title">Post Recientes</h2>
      <ul className="recent-posts-list">
        {recentPosts.map((post, index) => (
          <li
            key={post.id}
            className="recent-post-item"
            onClick={() => navigate(`/blog/${post.id}`)}
            style={{ cursor: "pointer" }}
          >
            <span className="post-number">{index + 1}</span>
            <div className="post-content">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-meta">
                {post.mainContent ? `${post.mainContent.substring(0, 100)}...` : 'No disponible'}
              </p>
              <p className="post-meta">
                {post.category} • {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/blogGrid.css";

export default function BlogGrid({ blogs = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const postsPerPage = 6;

  // Filtrar solo los blogs que están publicados
  const publishedBlogs = blogs.filter((blog) => blog.status === "published");

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = publishedBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(publishedBlogs.length / postsPerPage);

  if (!publishedBlogs.length) {
    return <div>No hay blogs publicados para mostrar.</div>;
  }

  return (
    <div className="blog-grid-container">
      <div className="tech_blog_posts_grid">
        {currentPosts.map((post) => (
          <article key={post.id} className="tech_blog_post_card">
            <img
              src={post.contentImage}
              alt={post.title}
              className="tech_blog_post_image"
            />
            <div className="tech_blog_post_content">
              <p>{new Date(post.createdAt).toLocaleDateString()}</p>
              <h3>{post.title}</h3>
              <p>{post.mainContent.substring(0, 150)}...</p>
              <button
                onClick={() => navigate(`/blog/${post.id}`)}
                className="read-more-button"
              >
                Leer más
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅ Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente ➡
        </button>
      </div>
    </div>
  );
}

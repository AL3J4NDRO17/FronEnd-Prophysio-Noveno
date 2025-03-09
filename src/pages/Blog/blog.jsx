import { useState } from "react";
import "./styles/blog.css";
import { getFilteredPosts } from "./hooks/post"; // Importamos la función de filtrado

export default function Blogger() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual

  const postsPerPage = 6; // Cantidad de posts por página

  const categories = [
    { id: "all", name: "Todos" },
    { id: "tech", name: "Tecnología" },
    { id: "kids", name: "Infantil" },
    { id: "rehab", name: "Rehabilitación" },
  ];

  const filteredPosts = getFilteredPosts(selectedCategory, searchQuery, sortOrder);

  // Calcula los posts que se mostrarán en la página actual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="blog-layout">
      {/* Sidebar Izquierdo */}
            <aside className="blog-sidebar left-sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Categorías</h3>
          <ul className="categories-list">
            {categories.map((category) => (
              <li
                key={category.id}
                className={`category-item ${selectedCategory === category.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setCurrentPage(1); // Reinicia la paginación al cambiar categoría
                }}
              >
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="blog-container_1">
        <div className="blog-header-section_1">
          <div className="blog-header_1">
            <h2>Blog</h2>
          </div>
          <h1 className="blog-tagline_1">Conocer, Aplicar, Transformar, Mejorar...</h1>
        </div>

        {/* Filtros */}
        <div className="blog-filters_1">
          <select
            className="filter-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Ordenar por</option>
            <option value="recent">Más reciente</option>
            <option value="oldest">Mayor fecha</option>
            <option value="az">A - Z</option>
            <option value="za">Z - A</option>
          </select>
          <input
            type="search"
            className="search-bar_1"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reinicia la paginación cuando se busca algo
            }}
          />
        </div>

        {/* Noticias */}
        <div className="blog-news_1">
          {currentPosts.map((post) => (
            <article key={post.id} className="news-card_1">
              <div className="news-card-image_1">
                <img src={post.image || "/placeholder.svg"} alt={post.title} />
              </div>
              <div className="news-card-content_1">
                <h3 className="news-card-title_1">{post.title}</h3>
                <span className="news-category">
                  {categories.find((cat) => cat.id === post.category)?.name || "Sin Categoría"}
                </span>
                <p className="news-card-description_1">{post.description}</p>
                <a href="#" className="read-more">Leer Más</a>
              </div>
            </article>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Derecho */}
      <aside className="blog-sidebar right-sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Posts Destacados</h3>
          <div className="featured-posts">
            {filteredPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="featured-post-card">
                <h4>{post.title}</h4>
                <div className="post-meta">
                  <span>Categoría: {categories.find((cat) => cat.id === post.category)?.name || "Sin Categoría"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

// BlogCategories.jsx
import { useCategories } from "../hooks/useClientCategories";
import "../styles/blogCategories.css";

export default function BlogCategories({ onCategoryClick }) {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return <div>Cargando categorías...</div>;
  }

  if (error) {
    return <div>Error cargando categorías.</div>;
  }

  return (
    <section className="blog-categories">
      <h2 className="categories-title">Categorías</h2>
      <div className="categories-container">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => onCategoryClick(category.id)}  // Usa category.id en vez de category.nombre

            style={{ cursor: 'pointer' }}
          >
          
            <div className="category-overlay">
              <span className="category-name">{category.nombre}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

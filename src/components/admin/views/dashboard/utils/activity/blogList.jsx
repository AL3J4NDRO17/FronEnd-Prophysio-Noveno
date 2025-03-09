export default function BlogList() {
    const articles = [
      {
        title: "Beneficios de la fisioterapia para la recuperación deportiva",
        date: "24/2/2025",
        readTime: "5",
      },
      {
        title: "Ejercicios recomendados para el dolor lumbar",
        date: "20/2/2025",
        readTime: "3",
      },
      {
        title: "Cómo prevenir lesiones en actividades cotidianas",
        date: "15/2/2025",
        readTime: "7",
      },
    ]
  
    return (
      <div className="adminDashboard-card">
        <div className="adminDashboard-card-header-full">
          <h3 className="adminDashboard-card-title-large">Artículos recientes</h3>
          <p className="adminDashboard-card-description">Últimas publicaciones del blog</p>
        </div>
        <div className="adminDashboard-card-content-full">
          <div className="adminDashboard-articles-list">
            {articles.map((article, i) => (
              <div key={i} className="adminDashboard-article-item">
                <div className="adminDashboard-article-thumbnail"></div>
                <div className="adminDashboard-article-info">
                  <h4 className="adminDashboard-article-title">{article.title}</h4>
                  <p className="adminDashboard-article-meta">
                    {article.date} • {article.readTime} min de lectura
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="adminDashboard-card-footer">
          <button className="adminDashboard-text-button adminDashboard-text-button-full">Ver todos los artículos</button>
        </div>
      </div>
    )
  }
  
  
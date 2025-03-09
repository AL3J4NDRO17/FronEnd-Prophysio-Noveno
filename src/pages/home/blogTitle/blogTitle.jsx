import "./blogTitle.css";

import FadeInSection from "../../../utils/animations/fadeInSection";

const BlogTitle = () => {
  return (
    <>
      <div className="blog-home-section">
        <FadeInSection>
          <div className="blog-home-container">
            <div className="blog-home-header">
              <h2 className="blog-home-title">Nuestro Blog</h2>
              <p className="blog-home-secondary-text">
                Descubre consejos, información y novedades sobre salud, rehabilitación y bienestar para mejorar tu calidad de vida.
              </p>
              <a href="/blog" className="blog-home-link">Acceder al Blog</a>
            </div>
          </div>
        </FadeInSection>
      </div>
    </>
  );
};

export default BlogTitle;

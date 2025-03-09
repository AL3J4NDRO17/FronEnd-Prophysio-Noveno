import './blog.css';
import IMG from "./resources/physiotherapy-concept-illustration-b.webp";
import SlideInRight from '../../../utils/animations/SlideRight';
import SlideInLeft from '../../../utils/animations/SlideLeft';
const BlogSection = () => {
    const blogPosts = [
        {
            id: 1,
            title: "¿Por qué ponemos atención a tu rango de movimiento?",
            excerpt: "Porque con ello podemos vigilar cada una de tus articulaciones. El rango de movimiento (ROM) es fundamental...",
            category: "Therapy - Centro de Rehabilitación",
            date: "Noviembre 4, 2023",
        },
        {
            id: 2,
            title: "Sedentarismo",
            excerpt: "¿Qué es el sedentarismo? Con frecuencia somos sedentarios, pero no nos damos cuenta. El sedentarismo es un...",
            category: "Therapy - Centro de Rehabilitación",
            date: "Diciembre 2, 2023",
        },
        {
            id: 3,
            title: "Rehabilitación deportiva con tecnología que mejora el desempeño",
            excerpt: "En la actualidad la tecnología juega un papel crucial en el entrenamiento y la rehabilitación deportiva. Ha...",
            category: "Therapy - Centro de Rehabilitación",
            date: "Mayo 4, 2023",
        },
        {
            id: 4,
            title: "Salud integral para mujeres: recomendaciones para cada etapa de la vida",
            excerpt: "Las etapas de la vida de una mujer, desde pequeñas hasta la madurez adulta, requieren cuidados en...",
            category: "Therapy - Centro de Rehabilitación",
            date: "Agosto 20, 2023",
        },
    ];

    return (
        <section className="blog-section">
            <SlideInLeft>
                <div className='blog-data-container'>
                    <div className='blog-container'>
                        <div className="blog-grid">
                            {blogPosts.map(post => (
                                <article key={post.id} className="blog-card">
                                    <img
                                        src={`https://picsum.photos/seed/${post.id}/600/400`}
                                        alt={post.title}
                                        className="blog-image"
                                    />
                                    <div className="blog-content">
                                        <div className="blog-category">{post.category}</div>
                                        <h3 className="blog-card-title">{post.title}</h3>
                                        <p className="blog-excerpt">{post.excerpt}</p>
                                        <div className="blog-metadata">
                                            <span>{post.date}</span>
                                            <span>•</span>
                                            <span>{post.category}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </SlideInLeft>
            <SlideInRight>
                <div className='blog-img-container'>
                    <img src={IMG}
                        alt="ProPhysio registro"
                        className="blog-img-icon"
                        width="800"  // Define el ancho real
                        height="400" // Define la altura real
                        loading="lazy" />
                </div>
            </SlideInRight>
        </section>
    );
}

export default BlogSection;

import "../styles/services.css"
import IMG from '../assets/lateralImg.webp'

const ServicesGrid = () => {
    const topServices = [
        { icon: "🧠", title: "Psychotherapy", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
        { icon: "💝", title: "Grief & Loss", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
        { icon: "🌟", title: "Coaching", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
        { icon: "📝", title: "Speaking", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    ]

    const mainServices = [
        { image: "https://placehold.co/600x400", title: "Anxiety Treatment", category: "GROUP THERAPY" },
        { image: "https://placehold.co/600x400", title: "Couples Therapy", category: "FAMILY" },
        { image: "https://placehold.co/600x400", title: "Family Practice", category: "FAMILY" },
        { image: "https://placehold.co/600x400", title: "Depression Therapy", category: "INDIVIDUAL THERAPY" },
        { image: "https://placehold.co/600x400", title: "Group Therapy", category: "GROUP THERAPY" },
        { image: "https://placehold.co/600x400", title: "Individual Coaching", category: "INDIVIDUAL COACHING" },
    ]

    return (
        <div className="services-container">
            <div className="top-services">
                {topServices.map((service, index) => (
                    <div key={index} className="service-item">
                        <span className="service-icon">{service.icon}</span>
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </div>
                ))}
            </div>
            <div className="main-services-section">
                <div className="main-left-img">
                    <img src={IMG}/>

                   
                </div>
                <div className="main-services">
                    {mainServices.map((service, index) => (
                        <div key={index} className="service-card">
                            <img src={service.image || "/placeholder.svg"} alt={service.title} />
                            <div className="card-content">
                                <span className="category">{service.category}</span>
                                <h3>{service.title}</h3>
                                <button className="learn-more">Learn More</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ServicesGrid


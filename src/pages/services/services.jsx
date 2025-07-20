import "./services.css"
import TopBannerServices from "./utils/topbanner"
import ServicesGrid from "./utils/servicesSection"
import ContactBanner from "./utils/bannerServices"

export default function ServicesSection() {
    return (
        <div className="services-page">
            <ContactBanner />
            <ServicesGrid />
            <TopBannerServices />

        </div>
    )
}


import ServicesGrid from './utils/servicesSection';
import ContactBanner from './utils/bannerServices';
import TopBannerServices from './utils/topbanner';


export default function ServicesSection() {
    return (
     <>
     <TopBannerServices/>
     <ServicesGrid/>
     <ContactBanner/>
     </>
    );
}

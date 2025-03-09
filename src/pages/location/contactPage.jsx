import LocationPage from "./location/locationpage"
import ContactSection from "./contact/contact"

import FadeInSection from "../../utils/animations/fadeInSection";

export default function ContactPage() {
    return (
        <main className="">
            <FadeInSection>
                <LocationPage />
            </FadeInSection>
            <FadeInSection>
                <ContactSection />
            </FadeInSection>
        </main>
    )
}


import HeroSection from "./hero/hero"

import ServicesGrid from "./services/services";
import Shortcut from "./shedulingShortcut/shedulingShortcut";
import BlogSection from "./blog/blog";
import TestimonialsSection from "./testimonials/testimonials";
import Appointment from "./appointment/appointment";
import BlogTitle from "./blogTitle/blogTitle";


import "./home.css"

export default function Home() {
    return (
        <>
            <div className="main-home">


                <HeroSection />

                <ServicesGrid />


                <BlogTitle />

                <BlogSection />

                <Shortcut />

                <TestimonialsSection />

                <Appointment />

            </div>

        </>
    );
}  
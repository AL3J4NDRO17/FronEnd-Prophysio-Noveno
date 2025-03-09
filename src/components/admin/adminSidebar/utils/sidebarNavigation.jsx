
import {
    TrendingUp,
    Users,
    Calendar,
    FileText,
    MessageSquare,
    ClipboardCheck,
    Settings,
    House,
} from "lucide-react";
import SidebarSection from "./sidebarSection";

export default function SidebarNavigation() {
    const navSections = [
        {
            title: null,
            items: [{ icon: TrendingUp, label: "Dashboard", url: "/admin/adminDashboard" }],
        },
        {
            title: "Pacientes",
            items: [
                { icon: Users, label: "Directorio", url: "/admin/adminUser" },
                { icon: Calendar, label: "Citas", url: "/admin/adminAppointments", badge: "8" },
              
            ],
        },
        {
            title: "Contenido",
            items: [
                { icon: FileText, label: "Blog", url: "/admin/adminBlogEditor" },
                { icon: MessageSquare, label: "Testimonios", url: "/admin/adminTestimonials" },
            ],
        },
        {
            title: "Administración",
            items: [
                { icon: ClipboardCheck, label: "Auditorías", url: "/auditorias" },

                { icon: Settings, label: "Configuración", url: "/admin/adminCompanySettings" },
            ],
        },
        {
            title: "Publico",
            items: [
                { icon: House, label: "Inicio", url: "/" },
                { icon: House, label: "Servicios", url: "/services" },
                { icon: House, label: "Acerca de", url: "/about" },
                { icon: House, label: "Blogs", url: "/blog" },
                { icon: House, label: "Ubicacion", url: "/location" },
            ],
        },
    ];

    return (
        <nav className="adminDashboard-sidebar-nav">
            <ul className="adminDashboard-nav-list">
                {navSections.map((section, index) => (
                    <SidebarSection key={index} title={section.title} items={section.items} />
                ))}
            </ul>
        </nav>
    );
}

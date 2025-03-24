import { NavLink } from "react-router-dom";

export default function SidebarSection({ title, items }) {
  return (
    <li className={title ? "adminDashboard-nav-section" : ""}>
      {title && <div className="adminDashboard-nav-section-title">{title}</div>}
      <ul className={title ? "adminDashboard-nav-sublist" : ""}>
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <li key={index}>
              <NavLink
                to={item.url} // ✅ Cambiado de href a to
                className={({ isActive }) =>
                  `adminDashboard-nav-item ${isActive ? "adminDashboard-nav-item-active" : ""}`
                }
              >
                <Icon className="adminDashboard-nav-icon" />
                {item.label}
                {item.badge && <span className="adminDashboard-badge">{item.badge}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

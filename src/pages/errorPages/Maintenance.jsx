import { ServerOff } from 'lucide-react'
import "./css/maintenance.css"

export default function ServerOfflinePage() {
  return (
    <div className="maintenance-container">
      <div className="maintenance-content">
        <div className="icon-wrapper">
          <div className="icon-background">
            <ServerOff className="server-icon" size={28} />
          </div>
          <div className="pulse-effect"></div>
        </div>

        <h1 className="maintenance-title">Servidor Offline</h1>

        <p className="maintenance-message">Estamos trabajando para restablecer el servicio lo antes posible.</p>

        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-dot"></span>
          <span className="status-dot"></span>
        </div>
      </div>
    </div>
  )
}


import { AlertCircle } from "lucide-react"


const AccountInfoForm = ({ userData, perfilActual }) => {
  // Usar datos del perfil actual si están disponibles
  const userInfo = perfilActual || userData

  // Formatear fecha de registro
  const formatearFecha = (fecha) => {
    if (!fecha) return "No disponible"

    try {
      return new Date(fecha).toLocaleDateString()
    } catch (error) {
      return "Formato de fecha inválido"
    }
  }

  return (
    <div className="account-info-form">
      <div className="account-info-row">
        <div className="account-info-label">Nombre de Usuario:</div>
        <div className="account-info-value">{userInfo.username || "No especificado"}</div>
      </div>

      <div className="account-info-row">
        <div className="account-info-label">Fecha de Registro:</div>
        <div className="account-info-value">
          {perfilActual ? formatearFecha(perfilActual.fechaRegistro) : "01/01/2023"}
        </div>
      </div>

      <div className="account-info-row">
        <div className="account-info-label">Último Acceso:</div>
        <div className="account-info-value">
          {perfilActual ? formatearFecha(perfilActual.ultimoAcceso) : formatearFecha(new Date())}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="currentPassword">Contraseña Actual</label>
        <input type="password" id="currentPassword" name="currentPassword" placeholder="Ingrese su contraseña actual" />
      </div>

      <div className="form-field">
        <label htmlFor="newPassword">Nueva Contraseña</label>
        <input type="password" id="newPassword" name="newPassword" placeholder="Ingrese su nueva contraseña" />
      </div>

      <div className="form-field">
        <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirme su nueva contraseña" />
      </div>

      <div className="info-box warning">
        <AlertCircle size={20} />
        <p>Cambiar tu contraseña cerrará todas tus sesiones activas y tendrás que iniciar sesión nuevamente.</p>
      </div>
    </div>
  )
}

export default AccountInfoForm


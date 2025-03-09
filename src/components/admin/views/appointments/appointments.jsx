import React, { useState } from "react";
import { CalendarIcon, Clock, Search, Plus, Filter, ChevronLeft, ChevronRight, MoreVertical, Edit, Trash, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import "./appointments.css";

function AppointmentsPage() {
  const [date, setDate] = useState(new Date());
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showCalendarPopover, setShowCalendarPopover] = useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setShowCalendarPopover(false);
  };

  const renderCalendar = () => {
    // Simplified calendar implementation
    const currentDate = new Date(date);
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay(); // 0 = Sunday
    
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    const dayNames = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
    
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="appointmentsAdmin-calendar-day empty"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = day === currentDate.getDate();
      days.push(
        <div 
          key={`day-${day}`} 
          className={`appointmentsAdmin-calendar-day ${isCurrentDay ? 'current' : ''}`}
          onClick={() => handleDateChange(new Date(currentYear, currentMonth, day))}
        >
          {day}
        </div>
      );
    }
    
    return (
      <div className="appointmentsAdmin-calendar">
        <div className="appointmentsAdmin-calendar-header">
          <button 
            className="appointmentsAdmin-calendar-nav-btn"
            onClick={() => setDate(new Date(currentYear, currentMonth - 1, 1))}
          >
            <ChevronLeft className="appointmentsAdmin-icon-sm" />
          </button>
          <div className="appointmentsAdmin-calendar-title">
            {monthNames[currentMonth]} {currentYear}
          </div>
          <button 
            className="appointmentsAdmin-calendar-nav-btn"
            onClick={() => setDate(new Date(currentYear, currentMonth + 1, 1))}
          >
            <ChevronRight className="appointmentsAdmin-icon-sm" />
          </button>
        </div>
        <div className="appointmentsAdmin-calendar-days-header">
          {dayNames.map(day => (
            <div key={day} className="appointmentsAdmin-calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="appointmentsAdmin-calendar-days-grid">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="appointmentsAdmin-container">
      {/* Header */}
      <header className="appointmentsAdmin-header">
        <div className="appointmentsAdmin-header-title">
          <h1>Gestión de Citas</h1>
        </div>
        <div className="appointmentsAdmin-header-actions">
          <div className="appointmentsAdmin-search-container">
            <Search className="appointmentsAdmin-search-icon" />
            <input
              type="text"
              placeholder="Buscar citas..."
              className="appointmentsAdmin-search-input"
            />
          </div>
          <button 
            className="appointmentsAdmin-btn appointmentsAdmin-btn-primary"
            onClick={() => setShowNewAppointmentModal(true)}
          >
            <Plus className="appointmentsAdmin-btn-icon" />
            Nueva cita
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="appointmentsAdmin-content">
        {/* Calendar sidebar */}
        <div className="appointmentsAdmin-sidebar">
          <div className="appointmentsAdmin-sidebar-calendar">
            {renderCalendar()}
          </div>
          <div className="appointmentsAdmin-filter-section">
            <h3 className="appointmentsAdmin-filter-title">Filtros</h3>
            <div className="appointmentsAdmin-filter-options">
              <div className="appointmentsAdmin-checkbox-item">
                <input type="checkbox" id="all" className="appointmentsAdmin-checkbox" defaultChecked />
                <label htmlFor="all" className="appointmentsAdmin-checkbox-label">
                  Todas las citas
                </label>
              </div>
              <div className="appointmentsAdmin-checkbox-item">
                <input
                  type="checkbox"
                  id="confirmed"
                  className="appointmentsAdmin-checkbox"
                  defaultChecked
                />
                <label htmlFor="confirmed" className="appointmentsAdmin-checkbox-label">
                  Confirmadas
                </label>
              </div>
              <div className="appointmentsAdmin-checkbox-item">
                <input
                  type="checkbox"
                  id="pending"
                  className="appointmentsAdmin-checkbox"
                  defaultChecked
                />
                <label htmlFor="pending" className="appointmentsAdmin-checkbox-label">
                  Pendientes
                </label>
              </div>
              <div className="appointmentsAdmin-checkbox-item">
                <input
                  type="checkbox"
                  id="cancelled"
                  className="appointmentsAdmin-checkbox"
                  defaultChecked
                />
                <label htmlFor="cancelled" className="appointmentsAdmin-checkbox-label">
                  Canceladas
                </label>
              </div>
            </div>
          </div>
          <div className="appointmentsAdmin-filter-section">
            <h3 className="appointmentsAdmin-filter-title">Tipo de cita</h3>
            <div className="appointmentsAdmin-filter-options">
              <div className="appointmentsAdmin-checkbox-item">
                <input
                  type="checkbox"
                  id="all-types"
                  className="appointmentsAdmin-checkbox"
                  defaultChecked
                />
                <label htmlFor="all-types" className="appointmentsAdmin-checkbox-label">
                  Todos los tipos
                </label>
              </div>
              <div className="appointmentsAdmin-checkbox-item">
                <input
                  type="checkbox"
                  id="evaluation"
                  className="appointmentsAdmin-checkbox"
                  defaultChecked
                />
                <label htmlFor="evaluation" className="appointmentsAdmin-checkbox-label">
                  Evaluación inicial
                </label>
              </div>
              <div className="appointmentsAdmin-checkbox-item">
                <input
                  type="checkbox"
                  id="therapy"
                  className="appointmentsAdmin-checkbox"
                  defaultChecked
                />
                <label htmlFor="therapy" className="appointmentsAdmin-checkbox-label">
                  Terapia
                </label>
              </div>
              <div className="appointmentsAdmin-checkbox-item">
                <input
                  type="checkbox"
                  id="followup"
                  className="appointmentsAdmin-checkbox"
                  defaultChecked
                />
                <label htmlFor="followup" className="appointmentsAdmin-checkbox-label">
                  Seguimiento
                </label>
              </div>
              <div className="appointmentsAdmin-checkbox-item">
                <input
                  type="checkbox"
                  id="massage"
                  className="appointmentsAdmin-checkbox"
                  defaultChecked
                />
                <label htmlFor="massage" className="appointmentsAdmin-checkbox-label">
                  Masaje
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="appointmentsAdmin-main">
          <div className="appointmentsAdmin-date-navigation">
            <div className="appointmentsAdmin-date-controls">
              <button className="appointmentsAdmin-btn appointmentsAdmin-btn-outline appointmentsAdmin-btn-sm">
                <ChevronLeft className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-mr" />
                Anterior
              </button>
              <div className="appointmentsAdmin-current-date">
                {formatDate(date)}
              </div>
              <button className="appointmentsAdmin-btn appointmentsAdmin-btn-outline appointmentsAdmin-btn-sm">
                Siguiente
                <ChevronRight className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-ml" />
              </button>
            </div>
            <div className="appointmentsAdmin-view-controls">
              <button className="appointmentsAdmin-btn appointmentsAdmin-btn-outline appointmentsAdmin-btn-sm">
                <Filter className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-mr" />
                Filtrar
              </button>
              <div className="appointmentsAdmin-select-container">
                <select className="appointmentsAdmin-select">
                  <option value="day">Vista diaria</option>
                  <option value="week">Vista semanal</option>
                  <option value="month">Vista mensual</option>
                </select>
              </div>
            </div>
          </div>

          <div className="appointmentsAdmin-card">
            <div className="appointmentsAdmin-card-header">
              <h2 className="appointmentsAdmin-card-title">Citas para hoy</h2>
            </div>
            <div className="appointmentsAdmin-card-content">
              <table className="appointmentsAdmin-table">
                <thead>
                  <tr>
                    <th className="appointmentsAdmin-th appointmentsAdmin-th-time">Hora</th>
                    <th className="appointmentsAdmin-th">Paciente</th>
                    <th className="appointmentsAdmin-th">Tipo</th>
                    <th className="appointmentsAdmin-th">Duración</th>
                    <th className="appointmentsAdmin-th">Estado</th>
                    <th className="appointmentsAdmin-th appointmentsAdmin-th-actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="appointmentsAdmin-td appointmentsAdmin-td-time">9:00 AM</td>
                    <td className="appointmentsAdmin-td">
                      <div className="appointmentsAdmin-patient-info">
                        <div className="appointmentsAdmin-avatar">
                          <div className="appointmentsAdmin-avatar-fallback">AM</div>
                        </div>
                        <div>Ana Martínez</div>
                      </div>
                    </td>
                    <td className="appointmentsAdmin-td">Evaluación inicial</td>
                    <td className="appointmentsAdmin-td">30 min</td>
                    <td className="appointmentsAdmin-td">
                      <span className="appointmentsAdmin-badge appointmentsAdmin-badge-confirmed">Confirmada</span>
                    </td>
                    <td className="appointmentsAdmin-td appointmentsAdmin-td-actions">
                      <div className="appointmentsAdmin-actions">
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <Edit className="appointmentsAdmin-icon-sm" />
                        </button>
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <Trash className="appointmentsAdmin-icon-sm" />
                        </button>
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <MoreVertical className="appointmentsAdmin-icon-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="appointmentsAdmin-td appointmentsAdmin-td-time">10:00 AM</td>
                    <td className="appointmentsAdmin-td">
                      <div className="appointmentsAdmin-patient-info">
                        <div className="appointmentsAdmin-avatar">
                          <div className="appointmentsAdmin-avatar-fallback">JL</div>
                        </div>
                        <div>Juan López</div>
                      </div>
                    </td>
                    <td className="appointmentsAdmin-td">Terapia de rehabilitación</td>
                    <td className="appointmentsAdmin-td">45 min</td>
                    <td className="appointmentsAdmin-td">
                      <span className="appointmentsAdmin-badge appointmentsAdmin-badge-pending">Pendiente</span>
                    </td>
                    <td className="appointmentsAdmin-td appointmentsAdmin-td-actions">
                      <div className="appointmentsAdmin-actions">
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <Edit className="appointmentsAdmin-icon-sm" />
                        </button>
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <Trash className="appointmentsAdmin-icon-sm" />
                        </button>
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <MoreVertical className="appointmentsAdmin-icon-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="appointmentsAdmin-td appointmentsAdmin-td-time">11:30 AM</td>
                    <td className="appointmentsAdmin-td">
                      <div className="appointmentsAdmin-patient-info">
                        <div className="appointmentsAdmin-avatar">
                          <div className="appointmentsAdmin-avatar-fallback">RC</div>
                        </div>
                        <div>Roberto Campos</div>
                      </div>
                    </td>
                    <td className="appointmentsAdmin-td">Seguimiento</td>
                    <td className="appointmentsAdmin-td">30 min</td>
                    <td className="appointmentsAdmin-td">
                      <span className="appointmentsAdmin-badge appointmentsAdmin-badge-confirmed">Confirmada</span>
                    </td>
                    <td className="appointmentsAdmin-td appointmentsAdmin-td-actions">
                      <div className="appointmentsAdmin-actions">
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <Edit className="appointmentsAdmin-icon-sm" />
                        </button>
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <Trash className="appointmentsAdmin-icon-sm" />
                        </button>
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <MoreVertical className="appointmentsAdmin-icon-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="appointmentsAdmin-td appointmentsAdmin-td-time">2:00 PM</td>
                    <td className="appointmentsAdmin-td">
                      <div className="appointmentsAdmin-patient-info">
                        <div className="appointmentsAdmin-avatar">
                          <div className="appointmentsAdmin-avatar-fallback">MT</div>
                        </div>
                        <div>María Torres</div>
                      </div>
                    </td>
                    <td className="appointmentsAdmin-td">Masaje terapéutico</td>
                    <td className="appointmentsAdmin-td">60 min</td>
                    <td className="appointmentsAdmin-td">
                      <span className="appointmentsAdmin-badge appointmentsAdmin-badge-cancelled">Cancelada</span>
                    </td>
                    <td className="appointmentsAdmin-td appointmentsAdmin-td-actions">
                      <div className="appointmentsAdmin-actions">
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <Edit className="appointmentsAdmin-icon-sm" />
                        </button>
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <Trash className="appointmentsAdmin-icon-sm" />
                        </button>
                        <button className="appointmentsAdmin-btn appointmentsAdmin-btn-icon">
                          <MoreVertical className="appointmentsAdmin-icon-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="appointmentsAdmin-stats-grid">
            <div className="appointmentsAdmin-card">
              <div className="appointmentsAdmin-card-header">
                <h2 className="appointmentsAdmin-card-title">Resumen de citas</h2>
              </div>
              <div className="appointmentsAdmin-card-content">
                <div className="appointmentsAdmin-stats-list">
                  <div className="appointmentsAdmin-stat-item">
                    <div className="appointmentsAdmin-stat-icon appointmentsAdmin-stat-icon-confirmed">
                      <CheckCircle className="appointmentsAdmin-icon-sm" />
                    </div>
                    <span className="appointmentsAdmin-stat-label">Confirmadas</span>
                    <span className="appointmentsAdmin-stat-value">8</span>
                  </div>
                  <div className="appointmentsAdmin-stat-item">
                    <div className="appointmentsAdmin-stat-icon appointmentsAdmin-stat-icon-pending">
                      <AlertCircle className="appointmentsAdmin-icon-sm" />
                    </div>
                    <span className="appointmentsAdmin-stat-label">Pendientes</span>
                    <span className="appointmentsAdmin-stat-value">3</span>
                  </div>
                  <div className="appointmentsAdmin-stat-item">
                    <div className="appointmentsAdmin-stat-icon appointmentsAdmin-stat-icon-cancelled">
                      <XCircle className="appointmentsAdmin-icon-sm" />
                    </div>
                    <span className="appointmentsAdmin-stat-label">Canceladas</span>
                    <span className="appointmentsAdmin-stat-value">1</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="appointmentsAdmin-card">
              <div className="appointmentsAdmin-card-header">
                <h2 className="appointmentsAdmin-card-title">Próximas citas</h2>
              </div>
              <div className="appointmentsAdmin-card-content">
                <div className="appointmentsAdmin-stats-list">
                  <div className="appointmentsAdmin-stat-item">
                    <div className="appointmentsAdmin-stat-icon appointmentsAdmin-stat-icon-time">
                      <Clock className="appointmentsAdmin-icon-sm" />
                    </div>
                    <span className="appointmentsAdmin-stat-label">Mañana</span>
                    <span className="appointmentsAdmin-stat-value">6</span>
                  </div>
                  <div className="appointmentsAdmin-stat-item">
                    <div className="appointmentsAdmin-stat-icon appointmentsAdmin-stat-icon-time">
                      <Clock className="appointmentsAdmin-icon-sm" />
                    </div>
                    <span className="appointmentsAdmin-stat-label">Esta semana</span>
                    <span className="appointmentsAdmin-stat-value">24</span>
                  </div>
                  <div className="appointmentsAdmin-stat-item">
                    <div className="appointmentsAdmin-stat-icon appointmentsAdmin-stat-icon-time">
                      <Clock className="appointmentsAdmin-icon-sm" />
                    </div>
                    <span className="appointmentsAdmin-stat-label">Este mes</span>
                    <span className="appointmentsAdmin-stat-value">86</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="appointmentsAdmin-modal-overlay">
          <div className="appointmentsAdmin-modal">
            <div className="appointmentsAdmin-modal-header">
              <h2 className="appointmentsAdmin-modal-title">Programar nueva cita</h2>
              <p className="appointmentsAdmin-modal-description">
                Complete los detalles para agendar una nueva cita con un paciente.
              </p>
            </div>
            <div className="appointmentsAdmin-modal-content">
              <div className="appointmentsAdmin-form-group">
                <label className="appointmentsAdmin-form-label">Paciente</label>
                <select className="appointmentsAdmin-form-select">
                  <option value="">Seleccionar paciente</option>
                  <option value="ana">Ana Martínez</option>
                  <option value="juan">Juan López</option>
                  <option value="roberto">Roberto Campos</option>
                  <option value="maria">María Torres</option>
                </select>
              </div>
              <div className="appointmentsAdmin-form-group">
                <label className="appointmentsAdmin-form-label">Fecha</label>
                <div className="appointmentsAdmin-date-picker">
                  <button 
                    className="appointmentsAdmin-date-picker-button"
                    onClick={() => setShowCalendarPopover(!showCalendarPopover)}
                  >
                    <CalendarIcon className="appointmentsAdmin-icon-sm appointmentsAdmin-icon-mr" />
                    {date ? date.toLocaleDateString() : "Seleccionar fecha"}
                  </button>
                  {showCalendarPopover && (
                    <div className="appointmentsAdmin-date-picker-popover">
                      {renderCalendar()}
                    </div>
                  )}
                </div>
              </div>
              <div className="appointmentsAdmin-form-group">
                <label className="appointmentsAdmin-form-label">Hora</label>
                <select className="appointmentsAdmin-form-select">
                  <option value="9:00">9:00 AM</option>
                  <option value="9:30">9:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                </select>
              </div>
              <div className="appointmentsAdmin-form-group">
                <label className="appointmentsAdmin-form-label">Duración</label>
                <select className="appointmentsAdmin-form-select">
                  <option value="15">15 minutos</option>
                  <option value="30" selected>30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">60 minutos</option>
                  <option value="90">90 minutos</option>
                </select>
              </div>
              <div className="appointmentsAdmin-form-group">
                <label className="appointmentsAdmin-form-label">Tipo</label>
                <select className="appointmentsAdmin-form-select">
                  <option value="evaluacion">Evaluación inicial</option>
                  <option value="terapia">Terapia de rehabilitación</option>
                  <option value="seguimiento">Seguimiento</option>
                  <option value="masaje">Masaje terapéutico</option>
                </select>
              </div>
              <div className="appointmentsAdmin-form-group">
                <label className="appointmentsAdmin-form-label">Notas</label>
                <textarea 
                  className="appointmentsAdmin-form-textarea" 
                  placeholder="Notas adicionales sobre la cita"
                ></textarea>
              </div>
            </div>
            <div className="appointmentsAdmin-modal-footer">
              <button 
                className="appointmentsAdmin-btn appointmentsAdmin-btn-outline"
                onClick={() => setShowNewAppointmentModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="appointmentsAdmin-btn appointmentsAdmin-btn-primary"
                onClick={() => setShowNewAppointmentModal(false)}
              >
                Programar cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;

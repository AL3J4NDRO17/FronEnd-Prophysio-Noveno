"use client"

import React, { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"
import { toast } from "react-toastify"
import "./calendar.css"

// Días en español para la visualización en el calendario (encabezados)
const DAY_TRANSLATIONS_DISPLAY = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]
// Días en inglés para la lógica interna (comparación con workHours)
const ENGLISH_DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

const Calendar = React.forwardRef(
  ({ className, selectedDate, onSelect, workHours, minDate, maxDate, ...props }, ref) => {
    const [displayDate, setDisplayDate] = useState(selectedDate || new Date())

    useEffect(() => {
      if (selectedDate) {
        setDisplayDate(selectedDate)
      }
    }, [selectedDate])

    const getDaysInMonth = useCallback((date) => {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDayOfMonth = new Date(year, month, 1)
      const lastDayOfMonth = new Date(year, month + 1, 0)
      const daysInMonth = lastDayOfMonth.getDate()
      const startDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday ...

      const days = []
      // Fill leading empty days
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null)
      }

      // Fill days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day))
      }
      return days
    }, [])

    const handlePrevMonth = () => {
      setDisplayDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    }

    const handleNextMonth = () => {
      setDisplayDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    }

    const handleDayClick = (dayDate) => {
      if (!dayDate) return

      const dayNameOfWeekEnglish = ENGLISH_DAYS_OF_WEEK[dayDate.getDay()] // Obtiene el nombre del día en inglés
      const isWorkingDay = workHours?.days.includes(dayNameOfWeekEnglish) // Compara con los días en inglés

      if (!isWorkingDay) {
        // Puedes usar la traducción para el mensaje de error si lo deseas
        const dayNameOfWeekSpanish = DAY_TRANSLATIONS_DISPLAY[dayDate.getDay()]
        toast.info(`El día seleccionado (${dayNameOfWeekSpanish}) no es un día laboral.`)
        return
      }

      // Check minDate and maxDate
      if (minDate && dayDate < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) {
        toast.info("No puedes seleccionar una fecha anterior a la fecha mínima permitida.")
        return
      }
      if (maxDate && dayDate > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) {
        toast.info("No puedes seleccionar una fecha posterior a la fecha máxima permitida.")
        return
      }

      onSelect(dayDate)
    }

    const days = getDaysInMonth(displayDate)

    return (
      <div className={`appointmentsAdmin-calendar-component ${className || ""}`} ref={ref} {...props}>
        <div className="appointmentsAdmin-calendar-header">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="appointmentsAdmin-icon-sm" />
          </Button>
          <h3 className="appointmentsAdmin-calendar-title">
            {MONTH_NAMES[displayDate.getMonth()]} {displayDate.getFullYear()}
          </h3>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="appointmentsAdmin-icon-sm" />
          </Button>
        </div>
        <div className="appointmentsAdmin-calendar-weekdays">
          {DAY_TRANSLATIONS_DISPLAY.map((day) => (
            <div key={day} className="appointmentsAdmin-calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="appointmentsAdmin-calendar-grid">
          {days.map((dayDate, index) => {
            const isCurrentMonth = dayDate && dayDate.getMonth() === displayDate.getMonth()
            const isSelected =
              selectedDate &&
              dayDate &&
              dayDate.getDate() === selectedDate.getDate() &&
              dayDate.getMonth() === selectedDate.getMonth() &&
              dayDate.getFullYear() === selectedDate.getFullYear()

            const dayNameOfWeekEnglish = dayDate ? ENGLISH_DAYS_OF_WEEK[dayDate.getDay()] : null // Obtiene el nombre del día en inglés
            const isWorkingDay = dayDate && workHours?.days.includes(dayNameOfWeekEnglish) // Compara con los días en inglés

            return (
              <div
                key={index}
                className={`
                  appointmentsAdmin-calendar-day-cell
                  ${!dayDate || !isCurrentMonth ? "empty" : ""}
                  ${isSelected ? "selected" : ""}
                  ${!isWorkingDay && dayDate ? "non-working-day" : ""}
                  ${(!minDate || dayDate >= new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) && (!maxDate || dayDate <= new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) ? "" : "disabled-range"}
                `}
                onClick={() => handleDayClick(dayDate)}
              >
                {dayDate ? dayDate.getDate() : ""}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
)
Calendar.displayName = "Calendar"

export { Calendar }

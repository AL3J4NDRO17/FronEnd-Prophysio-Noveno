import { useState } from "react"
import "./CalendarStep.css"

export function CalendarStep({ selectedDate, selectedTime, onSelect, onNext, onBack }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(selectedDate)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(selectedTime)

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ]

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const generateCalendarDays = () => {
    const days = []
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isSelected = selectedDay && date.toDateString() === selectedDay.toDateString()
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

      days.push(
        <button
          key={day}
          className={`calendar-day ${isSelected ? "selected" : ""} ${isPast ? "past" : ""}`}
          onClick={() => !isPast && setSelectedDay(date)}
          disabled={isPast}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  const handleNext = () => {
    if (selectedDay && selectedTimeSlot) {
      onSelect(selectedDay, selectedTimeSlot)
      onNext()
    }
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="calendar-step">
      <h2>Select Date & Time</h2>

      <div className="calendar">
        <div className="calendar-header">
          <button onClick={prevMonth}>&lt;</button>
          <h3>
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth}>&gt;</button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-day weekday">Sun</div>
          <div className="calendar-day weekday">Mon</div>
          <div className="calendar-day weekday">Tue</div>
          <div className="calendar-day weekday">Wed</div>
          <div className="calendar-day weekday">Thu</div>
          <div className="calendar-day weekday">Fri</div>
          <div className="calendar-day weekday">Sat</div>
          {generateCalendarDays()}
        </div>
      </div>

      {selectedDay && (
        <div className="time-slots">
          <h3>Available Times for {selectedDay.toLocaleDateString()}</h3>
          <div className="time-grid">
            {timeSlots.map((time) => (
              <button
                key={time}
                className={`time-slot ${selectedTimeSlot === time ? "selected" : ""}`}
                onClick={() => setSelectedTimeSlot(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="navigation">
        <button className="button button-secondary" onClick={onBack}>
          Back
        </button>
        <button className="button button-primary" onClick={handleNext} disabled={!selectedDay || !selectedTimeSlot}>
          Next
        </button>
      </div>
    </div>
  )
}


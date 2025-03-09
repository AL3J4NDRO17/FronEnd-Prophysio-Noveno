// src/components/Calendar.jsx
import React, { useState } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Importa los estilos por defecto

const Calendar = ({ onSelectDate }) => {
    const [date, setDate] = useState(new Date());

    const handleChange = (selectedDate) => {
        setDate(selectedDate);
        onSelectDate(selectedDate.toISOString().split('T')[0]); // Formato YYYY-MM-DD
    };

    return (
        <div className="calendar-popup">
            <ReactCalendar
                onChange={handleChange}
                value={date}
            />
        </div>
    );
};

export default Calendar;

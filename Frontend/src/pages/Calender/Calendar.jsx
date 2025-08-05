import React, { useMemo } from 'react';
import { format, addMonths, getDaysInMonth, isSameDay, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { APPOINTMENT_TYPES } from 'components/constants/AppointmentType';
import {useTranslation} from "react-i18next";

export const Calendar = ({appointments, currentDate, selectedDate, onDateChange, onSelectedDateChange, onNewAppointment, onEditAppointment}) => {
    const {t} = useTranslation();
    // Memoized values
    const daysInMonthCount = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
    const firstDay = useMemo(() => startOfMonth(currentDate).getDay(), [currentDate]);

    // Filtered appointments for date
    const getAppointmentsForDate = (date) => {
        return appointments.filter(apt => apt?.date && isSameDay(new Date(apt.date), date));
    };

    // Calendar rendering logic
    const renderCalendarDays = () => {
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
        }

        // Render days of the month
        for (let day = 1; day <= daysInMonthCount; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayAppointments = getAppointmentsForDate(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());

            days.push(
                <div
                    key={day}
                    onClick={() => onSelectedDateChange(date)}
                    className={`calendar-day 
                        ${isSelected ? 'selected' : ''} 
                        ${isToday ? 'today' : ''}
                        ${dayAppointments.length > 0 ? 'has-appointments' : ''}`}
                >
                    <div className="day-number">{day}</div>
                    <div className="appointment-previews">
                        {dayAppointments.slice(0, 3).map(apt => (
                            <div
                                key={apt.id}
                                className="appointment-preview"
                                style={{backgroundColor: APPOINTMENT_TYPES[apt.type].color}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEditAppointment(apt);
                                }}
                            >
                                <span className="time">{apt.time}</span>
                                <span> </span>
                                <span className="client">{apt.contact.clientName}</span>
                            </div>
                        ))}
                        {dayAppointments.length > 3 && (
                            <div className="more-appointments">
                                +{dayAppointments.length - 3} more
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="calendar-view">
            <div className="calendar-header">
                <div className="month-navigation">
                    <button onClick={() => onDateChange(addMonths(currentDate, -1))}>
                        <ChevronLeft size={20} />
                    </button>
                    <h2>{format(currentDate, 'MMMM yyyy')}</h2>
                    <button onClick={() => onDateChange(addMonths(currentDate, 1))}>
                        <ChevronRight size={20} />
                    </button>
                </div>
                <button
                    onClick={onNewAppointment}
                    className="new-appointment-button"
                >
                    <Plus size={20} />
                    {t("New Appointment")}
                </button>
            </div>

            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="day-header">{t(day)}</div>
                ))}
                {renderCalendarDays()}
            </div>
        </div>
    );
};
import React, {useCallback, useEffect, useState} from 'react';
import { format, isSameDay } from "date-fns";
import { CalendarIcon, Edit2, Trash2, Mail, Phone, BookOpen, User, Clock } from "lucide-react";
import { APPOINTMENT_TYPES } from "../../constants/AppointmentType";
import { Calendar } from "@/pages/Calender/Calendar";
import {deleteAppointment, fetchAppointments} from "@/store/calendar/action";
import {useDispatch, useSelector} from "react-redux";
import AppointmentModal from "./AppointmentModal";
import {useDeleteConfirmation} from "hooks/useDeleteConfirmation";
import {useTranslation} from "react-i18next";

export const AppointmentsList = () => {

    const dispatch = useDispatch();
    const { confirmDelete } = useDeleteConfirmation();
    const { appointments = [], loading, error } = useSelector(state => state.appointmentReducer);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [modalMode, setModalMode] = useState('create');
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(fetchAppointments());
    }, [dispatch]);
    console.log(appointments);
    // Handle appointment deletion
    const handleDeleteAppointment = useCallback((id) => {
        confirmDelete(id, (confirmedId) => {
            dispatch(deleteAppointment(confirmedId));
        });
    }, [dispatch]);

    // Handle modal close
    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setSelectedAppointment(null);
    }, []);

    // Handle creating new appointment
    const handleNewAppointment = useCallback(() => {
        setModalMode('create');
        setSelectedAppointment({
            date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
        });
        setModalOpen(true);
    }, [selectedDate]);

    // Handle editing appointment
    const handleEditAppointment = useCallback((appointment) => {
        setModalMode('edit');
        setSelectedAppointment(appointment);
        setModalOpen(true);
    }, []);

    const getAppointmentsForDate = useCallback((date) => {
        return Array.isArray(appointments) ? appointments.filter(apt => isSameDay(new Date(apt.date), date)) : [];
    }, [appointments]);


    const renderAppointmentsList = () => {
        if (!selectedDate) {
            return (
                <div className="no-selection">
                    {t("Select a date to view appointments.")}
                </div>
            );
        }

        const dateAppointments = getAppointmentsForDate(selectedDate);

        return (
            <>
                <h3 className="sidebar-header">
                    {/*<CalendarIcon size={20}/>*/}
                    {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                <div className="appointments-content">
                    {dateAppointments.map(apt => (
                        <div key={apt.id} className="appointment-card">
                            <div className="appointment-header"
                                 style={{backgroundColor: APPOINTMENT_TYPES[apt.type].color}}>
                                <span>{t(APPOINTMENT_TYPES[apt.type].label)}</span>
                                <div className="appointment-actions">
                                    <button onClick={() => handleEditAppointment(apt)} className="edit-button">
                                        <Edit2 size={16}/>
                                    </button>
                                    <button onClick={() => handleDeleteAppointment(apt.id)} className="delete-button">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                            <div className="appointment-details">
                                <div className="detail-row">
                                    <Clock size={16}/>
                                    <span>{apt.time} ({apt.duration} min)</span>
                                </div>
                                <div className="detail-row">
                                    <User size={16}/>
                                    <span>{apt.contact.clientName}</span>
                                </div>
                                <div className="detail-row">
                                    <BookOpen size={16}/>
                                    <span>{apt.caseNumber}</span>
                                </div>
                                <div className="detail-row">
                                    <Phone size={16}/>
                                    <span>{apt.contact.phone}</span>
                                </div>
                                <div className="detail-row">
                                    <Mail size={16}/>
                                    <span>{apt.contact.email}</span>
                                </div>
                                {apt.description && (
                                    <div className="appointment-description">
                                        {apt.description}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        // <div className="calendar-appointments-container">
        //     <div className="appointments-list">
        //         {renderAppointmentsList()}
        //     </div>
        //     <div className="main-content">
        //         <div id="calendar-wrapper">
        //             <Calendar
        //                 appointments={appointments}
        //                 currentDate={currentDate}
        //                 selectedDate={selectedDate}
        //                 onDateChange={setCurrentDate}
        //                 onSelectedDateChange={setSelectedDate}
        //                 onNewAppointment={handleNewAppointment}
        //                 onEditAppointment={handleEditAppointment}
        //             />
        //
        //             <AppointmentModal
        //                 isOpen={modalOpen}
        //                 onClose={handleModalClose}
        //                 appointment={selectedAppointment}
        //                 mode={modalMode}
        //             />
        //         </div>
        //     </div>
        // </div>
        <div className="calendar-container">
            <div className="appointments-list">
                {renderAppointmentsList()}
            </div>

            <div className="main-area-wrapper" data-id="calendar">
                <div className="main-area-content calendar-main">
                    <Calendar
                        appointments={appointments}
                        currentDate={currentDate}
                        selectedDate={selectedDate}
                        onDateChange={setCurrentDate}
                        onSelectedDateChange={setSelectedDate}
                        onNewAppointment={handleNewAppointment}
                        onEditAppointment={handleEditAppointment}
                    />

                    <AppointmentModal
                        isOpen={modalOpen}
                        onClose={handleModalClose}
                        appointment={selectedAppointment}
                        mode={modalMode}
                    />
                </div>
            </div>
        </div>

    );
};

export default AppointmentsList;
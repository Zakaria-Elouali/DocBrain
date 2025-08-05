import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { format } from 'date-fns';
import { APPOINTMENT_TYPES } from 'components/constants/AppointmentType';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import {addAppointment, editAppointment} from "@/store/calendar/action";
import {useTranslation} from "react-i18next";

const validationSchema = Yup.object({
    caseNumber: Yup.string(),
    type: Yup.string().required('Appointment type is required'),
    duration: Yup.number()
        .min(15, 'Duration must be at least 15 minutes')
        .required('Duration is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    description: Yup.string(),
    contact: Yup.object().shape({
        clientName: Yup.string().required('Client name is required'),
        phone: Yup.string(),
        email: Yup.string().email('Invalid email format'),
    }),
});

const AppointmentModal = ({ isOpen, onClose, appointment, onSave, mode }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const formik = useFormik({
        initialValues: {
            caseNumber: '',
            type: 'CONSULTATION',
            date: format(new Date(), 'yyyy-MM-dd'),
            time: '09:00',
            duration: 60,
            description: '',
            contact: {
                clientName: '',
                phone: '',
                email: ''
            },
            status: 'pending'
        },
        validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            const formattedValues = {
                ...values,
                date: new Date(values.date),
            };
            if (mode === 'create') {
                dispatch(addAppointment({ ...formattedValues, id: Date.now() }));
            } else {
                dispatch(editAppointment({ ...formattedValues, id: appointment.id }));
            }
            console.log('Form Values:', formattedValues);
            setSubmitting(false);
            onClose();
        },
        enableReinitialize: true
    });

    // Handle editing existing appointment
    useEffect(() => {
        if (appointment && mode === 'edit') {
            formik.setValues({
                caseNumber: appointment.caseNumber ,
                type: appointment.type ,
                date: appointment.date ,
                time: appointment.time ,
                duration: appointment.duration ,
                description: appointment.description ,
                contact: {
                    clientName: appointment.contact?.clientName ,
                    phone: appointment.contact?.phone ,
                    email: appointment.contact?.email
                },
                status: appointment.status
            });
        } else if (mode === 'create' && appointment?.date) {
            // Set only the date for new appointments, keeping other default values
            formik.setFieldValue('date', appointment.date);
        }
    }, [appointment, mode]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{mode === 'create' ? 'Create New Appointment' : 'Edit Appointment'}</h2>

                <form onSubmit={formik.handleSubmit} className="modal-form">
                    {/* Two Inputs per Row */}
                    <div className="modal-field-group">
                        <div className="modal-field">
                            <label>{t("Client Name")}</label>
                            <input
                                id="contact.clientName"
                                name="contact.clientName"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.contact.clientName}
                            />
                            {formik.touched.contact?.clientName && formik.errors.contact?.clientName && (
                                <div className="error">{formik.errors.contact.clientName}</div>
                            )}
                        </div>
                        <div className="modal-field">
                            <label>{t("Case Number")}</label>
                            <input
                                id="caseNumber"
                                name="caseNumber"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.caseNumber}
                            />
                        </div>
                    </div>

                    {/* Appointment Type and Duration */}
                    <div className="modal-field-group">
                        <div className="modal-field">
                            <label>{t("Type")}</label>
                            <select
                                id="type"
                                name="type"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.type}
                            >
                                {Object.entries(APPOINTMENT_TYPES).map(([key, { label }]) => (
                                    <option key={key} value={key}>
                                        {t(label)}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.type && formik.errors.type && (
                                <div className="error">{formik.errors.type}</div>
                            )}
                        </div>
                        <div className="modal-field">
                            <label>{t("Duration (minutes)")}</label>
                            <input
                                id="duration"
                                name="duration"
                                type="number"
                                min="15"
                                step="15"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.duration}
                            />
                            {formik.touched.duration && formik.errors.duration && (
                                <div className="error">{formik.errors.duration}</div>
                            )}
                        </div>
                    </div>

                    {/* Date and Time */}
                    <div className="modal-field-group">
                        <div className="modal-field">
                            <label>{t("Date")}</label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.date}
                            />
                            {formik.touched.date && formik.errors.date && (
                                <div className="error">{formik.errors.date}</div>
                            )}
                        </div>
                        <div className="modal-field">
                            <label>{t("Time")}</label>
                            <input
                                id="time"
                                name="time"
                                type="time"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.time}
                            />
                            {formik.touched.time && formik.errors.time && (
                                <div className="error">{formik.errors.time}</div>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="modal-field-group">
                        <div className="modal-field">
                            <label>{t("Phone")}</label>
                            <input
                                id="contact.phone"
                                name="contact.phone"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.contact.phone}
                            />
                        </div>
                        <div className="modal-field">
                            <label>{t("Email")}</label>
                            <input
                                id="contact.email"
                                name="contact.email"
                                type="email"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.contact.email}
                            />
                            {formik.touched.contact?.email && formik.errors.contact?.email && (
                                <div className="error">{formik.errors.contact.email}</div>
                            )}
                        </div>
                    </div>

                    {/* Description (Single Column) */}
                    <div className="modal-field">
                        <label>{t("Description")}</label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                        />
                    </div>

                    {/* Button Group */}
                    <div className="modal-button-group">
                        <button type="button" className="secondary" onClick={onClose}>
                            {t("Cancel")}
                        </button>
                        <button
                            type="submit"
                            className="primary"
                            disabled={formik.isSubmitting}
                        >
                            {mode === 'create' ? t('Create') : t('Save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentModal;
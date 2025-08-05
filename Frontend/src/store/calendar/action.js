// actions.js
import {
  ADD_APPOINTMENT,
  ADD_APPOINTMENT_SUCCESS,
  ADD_APPOINTMENT_FAILURE,
  EDIT_APPOINTMENT,
  EDIT_APPOINTMENT_SUCCESS,
  EDIT_APPOINTMENT_FAILURE,
  DELETE_APPOINTMENT,
  DELETE_APPOINTMENT_SUCCESS,
  DELETE_APPOINTMENT_FAILURE,
  FETCH_APPOINTMENTS,
  FETCH_APPOINTMENTS_SUCCESS,
  FETCH_APPOINTMENTS_FAILURE
} from './actiontype';

// Add Appointment
export const addAppointment = (appointment) => ({
  type: ADD_APPOINTMENT,
  payload: appointment
});

export const addAppointmentSuccess = (appointment) => ({
  type: ADD_APPOINTMENT_SUCCESS,
  payload: appointment
});

export const addAppointmentFailure = (error) => ({
  type: ADD_APPOINTMENT_FAILURE,
  payload: error
});

// Edit Appointment
export const editAppointment = (appointment) => ({
  type: EDIT_APPOINTMENT,
  payload: appointment
});

export const editAppointmentSuccess = (appointment) => ({
  type: EDIT_APPOINTMENT_SUCCESS,
  payload: appointment
});

export const editAppointmentFailure = (error) => ({
  type: EDIT_APPOINTMENT_FAILURE,
  payload: error
});

// Delete Appointment
export const deleteAppointment = (id) => ({
  type: DELETE_APPOINTMENT,
  payload: id
});

export const deleteAppointmentSuccess = (id) => ({
  type: DELETE_APPOINTMENT_SUCCESS,
  payload: id
});

export const deleteAppointmentFailure = (error) => ({
  type: DELETE_APPOINTMENT_FAILURE,
  payload: error
});

// Fetch Appointments
export const fetchAppointments = () => ({
  type: FETCH_APPOINTMENTS
});

export const fetchAppointmentsSuccess = (appointments) => ({
  type: FETCH_APPOINTMENTS_SUCCESS,
  payload: appointments
});

export const fetchAppointmentsFailure = (error) => ({
  type: FETCH_APPOINTMENTS_FAILURE,
  payload: error
});
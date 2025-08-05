// reducer.js
import {
  ADD_APPOINTMENT_SUCCESS,
  ADD_APPOINTMENT_FAILURE,
  EDIT_APPOINTMENT_SUCCESS,
  EDIT_APPOINTMENT_FAILURE,
  DELETE_APPOINTMENT_SUCCESS,
  DELETE_APPOINTMENT_FAILURE,
  FETCH_APPOINTMENTS_SUCCESS,
  FETCH_APPOINTMENTS_FAILURE
} from './actiontype';

const initialState = {
  appointments: [],
  error: null,
  loading: false // Optional: Add loading state
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
      // Add Appointment
    case ADD_APPOINTMENT_SUCCESS:
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
        error: null
      };
    case ADD_APPOINTMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      };

      // Edit Appointment
    case EDIT_APPOINTMENT_SUCCESS:
      return {
        ...state,
        appointments: state.appointments.map(apt =>
            apt.id === action.payload.id ? action.payload : apt
        ),
        error: null
      };
    case EDIT_APPOINTMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      };

      // Delete Appointment
    case DELETE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        appointments: state.appointments.filter(apt => apt.id !== action.payload),
        error: null
      };
    case DELETE_APPOINTMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      };

      // Fetch Appointments
    case FETCH_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        appointments: action.payload,
        error: null
      };
    case FETCH_APPOINTMENTS_FAILURE:
      return {
        ...state,
        error: action.payload
      };

    default:
      return state;
  }
};

export default appointmentReducer;
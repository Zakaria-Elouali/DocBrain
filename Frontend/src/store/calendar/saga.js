// sagas.js
import { takeLatest, put, call } from 'redux-saga/effects';
import {
  ADD_APPOINTMENT,
  EDIT_APPOINTMENT,
  DELETE_APPOINTMENT,
  FETCH_APPOINTMENTS,
} from './actiontype';

import {
  addAppointmentFailure, addAppointmentSuccess,
  deleteAppointmentFailure,
  deleteAppointmentSuccess, editAppointmentFailure, editAppointmentSuccess,
  fetchAppointmentsFailure,
  fetchAppointmentsSuccess
} from "./action";
import {
  ADD_APPOINTMENT_API,
  DELETE_APPOINTMENT_API,
  GET_APPOINTMENTS_API,
  UPDATE_APPOINTMENT_API
} from "@/helpers/url_helper";
import {APIClient} from "@/helpers/api_helper";

  const api = new APIClient();
// Add Appointment
function* addAppointmentSaga(action) {
  try {
    console.log("Add Appointment Saga", action.payload);
    const appointment = yield call(api.post, ADD_APPOINTMENT_API, action.payload);
    yield put(addAppointmentSuccess(appointment));
  } catch (error) {
    yield put(addAppointmentFailure(error.message));
  }
}

// Edit Appointment
function* editAppointmentSaga(action) {
  try {
    const id = action.payload.id;
    const apiUrl = UPDATE_APPOINTMENT_API.replace('{appointmentId}', id);
    const appointment = yield call(api.put, apiUrl, action.payload);
    yield put(editAppointmentSuccess(appointment));
  } catch (error) {
    yield put(editAppointmentFailure(error.message));
  }
}

// Delete Appointment
function* deleteAppointmentSaga(action) {
  try {
    const apiUrl = DELETE_APPOINTMENT_API.replace('{appointmentId}', action.payload);
    yield call(api.delete, apiUrl);
    yield put(deleteAppointmentSuccess(action.payload));
  } catch (error) {
    yield put(deleteAppointmentFailure(error.message));
  }
}

// Fetch Appointments
function* fetchAppointmentsSaga() {
  try {
    const appointments = yield call(api.get, GET_APPOINTMENTS_API);
    yield put(fetchAppointmentsSuccess(appointments));
  } catch (error) {
    yield put(fetchAppointmentsFailure(error.message));
  }
}

// Watcher Saga
export function* AppointmentsSaga() {
  yield takeLatest(ADD_APPOINTMENT, addAppointmentSaga);
  yield takeLatest(EDIT_APPOINTMENT, editAppointmentSaga);
  yield takeLatest(DELETE_APPOINTMENT, deleteAppointmentSaga);
  yield takeLatest(FETCH_APPOINTMENTS, fetchAppointmentsSaga);
}
import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  FETCH_EMPLOYEES_REQUEST,
  ADD_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_REQUEST,
  DELETE_EMPLOYEE_REQUEST,
  FETCH_CLIENTS_REQUEST,
  ADD_CLIENT_REQUEST,
  UPDATE_CLIENT_REQUEST,
  DELETE_CLIENT_REQUEST, FETCH_PROFILE_REQUEST, UPDATE_PROFILE_REQUEST,
} from './actionType';

import {
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  addEmployeeSuccess,
  addEmployeeFailure,
  updateEmployeeSuccess,
  updateEmployeeFailure,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,
  fetchClientsSuccess,
  fetchClientsFailure,
  addClientSuccess,
  addClientFailure,
  updateClientSuccess,
  updateClientFailure,
  deleteClientSuccess,
  deleteClientFailure, fetchProfileFailure, fetchProfileSuccess, updateProfileSuccess, updateProfileFailure,
} from './action';

import { APIClient } from '@/helpers/api_helper';
import {
  GET_EMPLOYEES,
  ADD_EMPLOYEE,
  UPDATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  GET_CLIENTS,
  ADD_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT, GET_USER_PROFILE, UPDATE_USER_PROFILE,
} from '@/helpers/url_helper';

const api = new APIClient();

// -----------------------------//                  EMPLOYEES SECTION               //------------------------------------------

// Fetch Employees
function* handleFetchEmployees(action) {
  try {
    const response = yield call(api.get, GET_EMPLOYEES);
    yield put(fetchEmployeesSuccess(response));
  } catch (error) {
    yield put(fetchEmployeesFailure(error.message));
  }
}

// Add Employee
function* handleAddEmployee(action) {
  try {
    console.log(action.payload);
    const { userData, roleIds } = action.payload;
    const response = yield call(api.post, ADD_EMPLOYEE, action.payload);
    yield put(addEmployeeSuccess(response));
  } catch (error) {
    yield put(addEmployeeFailure(error.message));
  }
}

// Update Employee
function* handleUpdateEmployee(action) {
  try {
    const { id, updatedData } = action.payload;
    const apiUrl = UPDATE_EMPLOYEE.replace('{employeeId}', id);
    const response = yield call(api.put, apiUrl, updatedData);
    yield put(updateEmployeeSuccess(response));
  } catch (error) {
    yield put(updateEmployeeFailure(error.message));
  }
}

// Delete Employee
function* handleDeleteEmployee(action) {
  try {
    const apiUrl = DELETE_EMPLOYEE.replace('{employeeId}', action.payload);
    const response = yield call(api.delete, apiUrl);
    yield put(deleteEmployeeSuccess(action.payload));
  } catch (error) {
    yield put(deleteEmployeeFailure(error.message));
  }
}

// -----------------------------//                  CLIENTS SECTION               //------------------------------------------

// Fetch Clients
function* handleFetchClients() {
  try {
    const response = yield call(api.get, GET_CLIENTS);
    yield put(fetchClientsSuccess(response));
  } catch (error) {
    yield put(fetchClientsFailure(error.message));
  }
}

// Add Client
function* handleAddClient(action) {
  try {
    const response = yield call(api.post, ADD_CLIENT, action.payload);
    yield put(addClientSuccess(response));
  } catch (error) {
    yield put(addClientFailure(error.message));
  }
}

// Update Client
function* handleUpdateClient(action) {
  try {
    const { id, updatedData } = action.payload;
    const apiUrl = UPDATE_CLIENT.replace('{clientId}', id);
    const response = yield call(api.put, apiUrl, updatedData);
    yield put(updateClientSuccess(response));
  } catch (error) {
    yield put(updateClientFailure(error.message));
  }
}

// Delete Client
function* handleDeleteClient(action) {
  try {
    const apiUrl = DELETE_CLIENT.replace('{clientId}', action.payload);
    const response = yield call(api.delete, apiUrl);
    yield put(deleteClientSuccess(action.payload));
  } catch (error) {
    yield put(deleteClientFailure(error.message));
  }
}

// -----------------------------//                  Profile Section               //------------------------------------------

// Fetch Profile
function* handleFetchProfile() {
  try {
    const response = yield call(api.get, GET_USER_PROFILE);
    yield put(fetchProfileSuccess(response));
  } catch (error) {
    yield put(fetchProfileFailure(error.message));
  }
}
// Update Profile
function* handleUpdateProfile(action) {
  try {
    const response = yield call(api.put, UPDATE_USER_PROFILE, action.payload);
    yield put(updateProfileSuccess(response));
  } catch (error) {
    yield put(updateProfileFailure(error.message));
  }
}
// -----------------------------//                 ROOT SAGA               //------------------------------------------
export default function* UserSaga() {
  // Employees
  yield takeLatest(FETCH_EMPLOYEES_REQUEST, handleFetchEmployees);
  yield takeLatest(ADD_EMPLOYEE_REQUEST, handleAddEmployee);
  yield takeLatest(UPDATE_EMPLOYEE_REQUEST, handleUpdateEmployee);
  yield takeLatest(DELETE_EMPLOYEE_REQUEST, handleDeleteEmployee);

  // Clients
  yield takeLatest(FETCH_CLIENTS_REQUEST, handleFetchClients);
  yield takeLatest(ADD_CLIENT_REQUEST, handleAddClient);
  yield takeLatest(UPDATE_CLIENT_REQUEST, handleUpdateClient);
  yield takeLatest(DELETE_CLIENT_REQUEST, handleDeleteClient);

  // Profile
  yield takeLatest(FETCH_PROFILE_REQUEST, handleFetchProfile);
  yield takeLatest(UPDATE_PROFILE_REQUEST, handleUpdateProfile);
}
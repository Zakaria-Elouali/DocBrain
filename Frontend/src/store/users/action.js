// Employees
import {
    ADD_CLIENT_FAILURE,
    ADD_CLIENT_REQUEST,
    ADD_CLIENT_SUCCESS,
    ADD_EMPLOYEE_FAILURE,
    ADD_EMPLOYEE_REQUEST,
    ADD_EMPLOYEE_SUCCESS,
    DELETE_CLIENT_FAILURE,
    DELETE_CLIENT_REQUEST,
    DELETE_CLIENT_SUCCESS,
    DELETE_EMPLOYEE_FAILURE,
    DELETE_EMPLOYEE_REQUEST,
    DELETE_EMPLOYEE_SUCCESS,
    FETCH_CLIENTS_FAILURE,
    FETCH_CLIENTS_REQUEST,
    FETCH_CLIENTS_SUCCESS,
    FETCH_EMPLOYEES_FAILURE,
    FETCH_EMPLOYEES_REQUEST,
    FETCH_EMPLOYEES_SUCCESS,
    FETCH_PROFILE_FAILURE, FETCH_PROFILE_REQUEST,
    FETCH_PROFILE_SUCCESS,
    UPDATE_CLIENT_FAILURE,
    UPDATE_CLIENT_REQUEST,
    UPDATE_CLIENT_SUCCESS,
    UPDATE_EMPLOYEE_FAILURE,
    UPDATE_EMPLOYEE_REQUEST,
    UPDATE_EMPLOYEE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS
} from "./actionType";

// -----------------------------//                  EMPLOYEES SECTION               //------------------------------------------
export const fetchEmployeesRequest = () => ({
    type: FETCH_EMPLOYEES_REQUEST,
});

export const fetchEmployeesSuccess = (employees) => ({
    type: FETCH_EMPLOYEES_SUCCESS,
    payload: employees,
});

export const fetchEmployeesFailure = (error) => ({
    type: FETCH_EMPLOYEES_FAILURE,
    payload: error,
});

export const addEmployeeRequest = (employee) => ({
    type: ADD_EMPLOYEE_REQUEST,
    payload: employee,
});

export const addEmployeeSuccess = (employee) => ({
    type: ADD_EMPLOYEE_SUCCESS,
    payload: employee,
});

export const addEmployeeFailure = (error) => ({
    type: ADD_EMPLOYEE_FAILURE,
    payload: error,
});

export const updateEmployeeRequest = (employee) => ({
    type: UPDATE_EMPLOYEE_REQUEST,
    payload: employee,
});

export const updateEmployeeSuccess = (employee) => ({
    type: UPDATE_EMPLOYEE_SUCCESS,
    payload: employee,
});

export const updateEmployeeFailure = (error) => ({
    type: UPDATE_EMPLOYEE_FAILURE,
    payload: error,
});

export const deleteEmployeeRequest = (id) => ({
    type: DELETE_EMPLOYEE_REQUEST,
    payload: id,
});

export const deleteEmployeeSuccess = (id) => ({
    type: DELETE_EMPLOYEE_SUCCESS,
    payload: id,
});

export const deleteEmployeeFailure = (error) => ({
    type: DELETE_EMPLOYEE_FAILURE,
    payload: error,
});

// -----------------------------//                  CLIENTS SECTION               //------------------------------------------
export const fetchClientsRequest = () => ({
    type: FETCH_CLIENTS_REQUEST,
});

export const fetchClientsSuccess = (clients) => ({
    type: FETCH_CLIENTS_SUCCESS,
    payload: clients,
});

export const fetchClientsFailure = (error) => ({
    type: FETCH_CLIENTS_FAILURE,
    payload: error,
});

export const addClientRequest = (client) => ({
    type: ADD_CLIENT_REQUEST,
    payload: client,
});

export const addClientSuccess = (client) => ({
    type: ADD_CLIENT_SUCCESS,
    payload: client,
});

export const addClientFailure = (error) => ({
    type: ADD_CLIENT_FAILURE,
    payload: error,
});

export const updateClientRequest = (client) => ({
    type: UPDATE_CLIENT_REQUEST,
    payload: client,
});

export const updateClientSuccess = (client) => ({
    type: UPDATE_CLIENT_SUCCESS,
    payload: client,
});

export const updateClientFailure = (error) => ({
    type: UPDATE_CLIENT_FAILURE,
    payload: error,
});

export const deleteClientRequest = (id) => ({
    type: DELETE_CLIENT_REQUEST,
    payload: id,
});

export const deleteClientSuccess = (id) => ({
    type: DELETE_CLIENT_SUCCESS,
    payload: id,
});

export const deleteClientFailure = (error) => ({
    type: DELETE_CLIENT_FAILURE,
    payload: error,
});

// -----------------------------//                  PROFILE SECTION               //------------------------------------------
export const fetchProfileRequest = () => ({
    type: FETCH_PROFILE_REQUEST,
});

export const fetchProfileSuccess = (profile) => ({
    type: FETCH_PROFILE_SUCCESS,
    payload: profile,
});

export const fetchProfileFailure = (error) => ({
    type: FETCH_PROFILE_FAILURE,
    payload: error,
});

export const updateProfileRequest = (profile) => ({
    type: UPDATE_PROFILE_REQUEST,
    payload: profile,
});

export const updateProfileSuccess = (profile) => ({
    type: UPDATE_PROFILE_SUCCESS,
    payload: profile,
});

export const updateProfileFailure = (error) => ({
    type: UPDATE_PROFILE_FAILURE,
    payload: error,
});
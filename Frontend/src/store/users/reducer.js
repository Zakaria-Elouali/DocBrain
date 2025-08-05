import {
    ADD_CLIENT_FAILURE, ADD_CLIENT_REQUEST, ADD_CLIENT_SUCCESS,
    ADD_EMPLOYEE_FAILURE,
    ADD_EMPLOYEE_REQUEST,
    ADD_EMPLOYEE_SUCCESS,
    DELETE_CLIENT_FAILURE, DELETE_CLIENT_REQUEST, DELETE_CLIENT_SUCCESS,
    DELETE_EMPLOYEE_FAILURE,
    DELETE_EMPLOYEE_REQUEST,
    DELETE_EMPLOYEE_SUCCESS,
    FETCH_CLIENTS_FAILURE, FETCH_CLIENTS_REQUEST,
    FETCH_CLIENTS_SUCCESS,
    FETCH_EMPLOYEES_FAILURE,
    FETCH_EMPLOYEES_REQUEST,
    FETCH_EMPLOYEES_SUCCESS, FETCH_PROFILE_FAILURE, FETCH_PROFILE_REQUEST, FETCH_PROFILE_SUCCESS,
    UPDATE_CLIENT_FAILURE, UPDATE_CLIENT_REQUEST, UPDATE_CLIENT_SUCCESS,
    UPDATE_EMPLOYEE_FAILURE,
    UPDATE_EMPLOYEE_REQUEST,
    UPDATE_EMPLOYEE_SUCCESS, UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS
} from "./actionType";

const initialState = {
    employees: [],
    clients: [],
    loading: false,
    error: null,
    userProfile: null,
};

const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        // Employees
        case FETCH_EMPLOYEES_REQUEST:
        case ADD_EMPLOYEE_REQUEST:
        case UPDATE_EMPLOYEE_REQUEST:
        case DELETE_EMPLOYEE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_EMPLOYEES_SUCCESS:
            return {
                ...state,
                employees: action.payload,
                loading: false,
            };

        case ADD_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employees: [...state.employees, action.payload],
                loading: false,
            };

        case UPDATE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employees: state.employees.map((emp) =>
                    emp.id === action.payload.id ? action.payload : emp
                ),
                loading: false,
            };

        case DELETE_EMPLOYEE_SUCCESS:
            return {
                ...state,
                employees: state.employees.filter((emp) => emp.id !== action.payload),
                loading: false,
            };

        case FETCH_EMPLOYEES_FAILURE:
        case ADD_EMPLOYEE_FAILURE:
        case UPDATE_EMPLOYEE_FAILURE:
        case DELETE_EMPLOYEE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        // Clients
        case FETCH_CLIENTS_REQUEST:
        case ADD_CLIENT_REQUEST:
        case UPDATE_CLIENT_REQUEST:
        case DELETE_CLIENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_CLIENTS_SUCCESS:
            return {
                ...state,
                clients: action.payload,
                loading: false,
            };

        case ADD_CLIENT_SUCCESS:
            return {
                ...state,
                clients: [...state.clients, action.payload],
                loading: false,
            };

        case UPDATE_CLIENT_SUCCESS:
            return {
                ...state,
                clients: state.clients.map((client) =>
                    client.id === action.payload.id ? action.payload : client
                ),
                loading: false,
            };

        case DELETE_CLIENT_SUCCESS:
            return {
                ...state,
                clients: state.clients.filter((client) => client.id !== action.payload),
                loading: false,
            };

        case FETCH_CLIENTS_FAILURE:
        case ADD_CLIENT_FAILURE:
        case UPDATE_CLIENT_FAILURE:
        case DELETE_CLIENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        // Profile
        case FETCH_PROFILE_REQUEST:
        case UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_PROFILE_SUCCESS:
        case UPDATE_PROFILE_SUCCESS:
        return {
            ...state,
            userProfile: action.payload,
            loading: false,
        };
        case FETCH_PROFILE_FAILURE:
        case UPDATE_PROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default UserReducer;
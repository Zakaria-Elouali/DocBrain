// rolesReducer.js
import {
  FETCH_ROLES_REQUEST,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_FAILURE,
  ADD_ROLE_REQUEST,
  ADD_ROLE_SUCCESS,
  ADD_ROLE_FAILURE,
  UPDATE_ROLE_PERMISSIONS_REQUEST,
  UPDATE_ROLE_PERMISSIONS_SUCCESS,
  UPDATE_ROLE_PERMISSIONS_FAILURE,
  FETCH_PERMISSIONS_REQUEST,
  FETCH_PERMISSIONS_SUCCESS,
  FETCH_PERMISSIONS_FAILURE,
} from './actionType';

const initialState = {
  roles: [], // List of roles
  permissions: [], // List of permissions
  loading: false, // Loading state
  error: null, // Error state
};

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
      // Fetch Roles
    case FETCH_ROLES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ROLES_SUCCESS:
      return {
        ...state,
        loading: false,
        roles: action.payload,
      };
    case FETCH_ROLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      // Add Role
    case ADD_ROLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        roles: [...state.roles, action.payload],
      };
    case ADD_ROLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      // Update Role Permissions
    case UPDATE_ROLE_PERMISSIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_ROLE_PERMISSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        roles: state.roles.map((role) =>
            role.id === action.payload.id ? action.payload : role
        ),
      };
    case UPDATE_ROLE_PERMISSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

      // Fetch Permissions
    case FETCH_PERMISSIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PERMISSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        permissions: action.payload,
      };
    case FETCH_PERMISSIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default rolesReducer;
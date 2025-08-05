// rolesActions.js
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
} from './actiontype';

// Fetch Roles
export const fetchRolesRequest = () => ({
  type: FETCH_ROLES_REQUEST,
});

export const fetchRolesSuccess = (roles) => ({
  type: FETCH_ROLES_SUCCESS,
  payload: roles,
});

export const fetchRolesFailure = (error) => ({
  type: FETCH_ROLES_FAILURE,
  payload: error,
});

// Add Role
export const addRoleRequest = (role) => ({
  type: ADD_ROLE_REQUEST,
  payload: role,
});

export const addRoleSuccess = (role) => ({
  type: ADD_ROLE_SUCCESS,
  payload: role,
});

export const addRoleFailure = (error) => ({
  type: ADD_ROLE_FAILURE,
  payload: error,
});

// Update Role Permissions
export const updateRolePermissionsRequest = (roleId, permissions) => ({
  type: UPDATE_ROLE_PERMISSIONS_REQUEST,
  payload: { roleId, permissions },
});

export const updateRolePermissionsSuccess = (role) => ({
  type: UPDATE_ROLE_PERMISSIONS_SUCCESS,
  payload: role,
});

export const updateRolePermissionsFailure = (error) => ({
  type: UPDATE_ROLE_PERMISSIONS_FAILURE,
  payload: error,
});

// Fetch Permissions
export const fetchPermissionsRequest = () => ({
  type: FETCH_PERMISSIONS_REQUEST,
});

export const fetchPermissionsSuccess = (permissions) => ({
  type: FETCH_PERMISSIONS_SUCCESS,
  payload: permissions,
});

export const fetchPermissionsFailure = (error) => ({
  type: FETCH_PERMISSIONS_FAILURE,
  payload: error,
});
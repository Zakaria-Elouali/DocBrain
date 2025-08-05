// rolesSaga.js
import { takeLatest, put, call } from 'redux-saga/effects';
import {
  FETCH_ROLES_REQUEST,
  ADD_ROLE_REQUEST,
  UPDATE_ROLE_PERMISSIONS_REQUEST,
  FETCH_PERMISSIONS_REQUEST,
} from './actiontype';

import {
  fetchRolesSuccess,
  fetchRolesFailure,
  addRoleSuccess,
  addRoleFailure,
  updateRolePermissionsSuccess,
  updateRolePermissionsFailure,
  fetchPermissionsSuccess,
  fetchPermissionsFailure,
} from './action';

import {
  FETCH_ROLES_API,
  ADD_ROLE_API,
  UPDATE_ROLE_PERMISSIONS_API,
  FETCH_PERMISSIONS_API,
} from '@/helpers/url_helper'; // Adjust the import path
import { APIClient } from '@/helpers/api_helper'; // Adjust the import path

const api = new APIClient();

// Fetch Roles
function* fetchRolesSaga() {
  try {
    const roles = yield call(api.get, FETCH_ROLES_API);
    yield put(fetchRolesSuccess(roles));
  } catch (error) {
    yield put(fetchRolesFailure(error.message));
  }
}

// Add Role
function* addRoleSaga(action) {
  try {
    const role = yield call(api.post, ADD_ROLE_API, action.payload);
    yield put(addRoleSuccess(role));
  } catch (error) {
    yield put(addRoleFailure(error.message));
  }
}

// Update Role Permissions
function* updateRolePermissionsSaga(action) {
  try {
    const { roleId, permissions } = action.payload;
    const apiUrl = UPDATE_ROLE_PERMISSIONS_API.replace('{roleId}', roleId);
    const updatedRole = yield call(api.put, apiUrl, { permissions });
    yield put(updateRolePermissionsSuccess(updatedRole));
  } catch (error) {
    yield put(updateRolePermissionsFailure(error.message));
  }
}

// Fetch Permissions
function* fetchPermissionsSaga() {
  try {
    const permissions = yield call(api.get, FETCH_PERMISSIONS_API);
    yield put(fetchPermissionsSuccess(permissions));
  } catch (error) {
    yield put(fetchPermissionsFailure(error.message));
  }
}

// Watcher Saga
export function* rolesSaga() {
  yield takeLatest(FETCH_ROLES_REQUEST, fetchRolesSaga);
  yield takeLatest(ADD_ROLE_REQUEST, addRoleSaga);
  yield takeLatest(UPDATE_ROLE_PERMISSIONS_REQUEST, updateRolePermissionsSaga);
  yield takeLatest(FETCH_PERMISSIONS_REQUEST, fetchPermissionsSaga);
}
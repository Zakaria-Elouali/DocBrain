import { call, put, takeEvery } from "redux-saga/effects";

import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";

import { LOGIN } from "@/helpers/url_helper";
import { APIClient } from "@/helpers/api_helper";

const api = new APIClient();

function* loginUser({ payload: { user, callback } }) {
  try {
    const response = yield call(api.post, LOGIN, {
      username: user.username,
      password: user.password,
    });

    const data ={
      fullName: response.fullName,
      token: response.token,
      refreshToken: response.refreshToken,
      roles: response.roles,
      permissions: response.permissions,

    };
    sessionStorage.setItem("authUser", JSON.stringify(response));
    if (response) {
      yield put(loginSuccess(response));
      //history("/dashboard");
      // window.location.href = "/home";
      window.location.href = "/dashboard";
    } else {
    console.error("saga Error response : " + response);
      yield put(apiError(response));
    }
  } catch (error) {
    console.error(error);
    if (callback) {callback(error);}
    yield put(apiError(error));
  }
}

function* logoutUser() {
  try {
    sessionStorage.removeItem("authUser");
    yield put(logoutUserSuccess(LOGOUT_USER, true));
  } catch (error) {
    yield put(apiError(LOGOUT_USER, error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;

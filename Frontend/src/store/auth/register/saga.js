import { all, call, fork, put, takeEvery } from "redux-saga/effects";
import { REGISTER_USER } from "./actionTypes";
import { registerUserFailed, registerUserSuccessful } from "./actions";
import {SIGNUP} from "../../../helpers/url_helper";
// import {apiError} from "../login/actions";
import {APIClient} from "../../../helpers/api_helper";

const api = new APIClient();

function* registerUser({ payload: { user, callback } }) {
  try {
    const response = yield call(api.post, SIGNUP,     {
      fullName : user.fullName,
      username : user.username,
      companyName : user.companyName,
      email : user.email,
      password : user.password,
    });

      yield put(registerUserSuccessful(response));
      window.location.href = "/email-confirmation";

  } catch (error) {
    if (callback) {callback(error);}
    yield put(registerUserFailed({ message: error.message || "An unexpected error occurred." }));
    // }
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser);
}

function* accountSaga() {
  yield all([fork(watchUserRegister)]);
}

export default accountSaga;

import { all, fork, put, takeEvery } from "redux-saga/effects";

import { FORGET_PASSWORD } from "./actionTypes";
import { userForgetPasswordError, userForgetPasswordSuccess } from "./actions";

function* forgetUser() {
  try {
    const response = {};
    if (response) {
      yield put(
        userForgetPasswordSuccess(
          "Reset link are sended to your mailbox, check there first",
        ),
      );
    }
  } catch (error) {
    yield put(userForgetPasswordError(error));
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)]);
}

export default forgetPasswordSaga;

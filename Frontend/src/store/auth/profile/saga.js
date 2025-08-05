import { all, fork, put, takeEvery } from "redux-saga/effects";

// Login Redux States
import { EDIT_PROFILE } from "./actionTypes";
import { profileError } from "./actions";

//Include Both Helper File with needed methods

function* editProfile({ payload: { user } }) {
  try {
    // TODO edit profile
    const nop = () => {};
  } catch (error) {
    yield put(profileError(error));
  }
}

export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile);
}

function* ProfileSaga() {
  yield all([fork(watchProfile)]);
}

export default ProfileSaga;

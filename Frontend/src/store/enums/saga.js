import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { GET_ENUMS } from "./actiontype";
import { getEnumsSuccees } from "./action";
import { ENUMS } from "../../helpers/url_helper";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

function* getEnums(params) {
  try {
    const response = yield call(
      api.get,
      ENUMS + "?languageCode=" + params.payload.data,
    );
    yield put(getEnumsSuccees(GET_ENUMS, response));
  } catch (error) {
    console.error(error);
  }
}

export function* watchGetEnumsList() {
  yield takeEvery(GET_ENUMS, getEnums);
}

function* enumSaga() {
  yield all([fork(watchGetEnumsList)]);
}

export default enumSaga;

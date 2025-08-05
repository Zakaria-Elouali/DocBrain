// import { all, call, fork, put, takeEvery } from "redux-saga/effects";
//
// // Crypto Redux States
// import {
//   LIKE_API_REQUEST,
//   GET_LIKE_API_REQUEST,
//   DISLIKE_API_REQUEST,
//   GET_USER_LIKES_BY_ENTITY_NAME_API_REQUEST,
//   COUNT_LIKES_BY_ENTITY_RECORD_API_REQUEST,
//   GET_COMMENTS_API_REQUEST,
//   GET_COMMENTS_RECORD_ID_API_REQUEST,
//   SAVE_COMMENT_API_REQUEST,
//   INTERACTION_PARAMETERS_API_REQUEST,
//   DELETE_COMMENT_API_REQUEST,
// } from "./actionType";
// import {
//   likeApiSuccess,
//   likeApiError,
//   getLikeApiSuccess,
//   getLikeApiError,
//   dislikeApiSuccess,
//   dislikeApiError,
//   getUserLikesByEntityNameApiSuccess,
//   getUserLikesByEntityNameApiError,
//   countLikesByEntityRecordApiSuccess,
//   countLikesByEntityRecordApiError,
//   getCommentsApiSuccess,
//   getCommentsApiError,
//   getCommentsByRecordIdApiSuccess,
//   getCommentsByRecordIdApiError,
//   LoadingInteractionApi,
//   saveCommentApiSuccess,
//   saveCommentApiError,
//   getInteractionParametersApiSuccess,
//   getInteractionParametersApiError,
//   deleteCommentsApiSuccess,
//   deleteCommentsApiError,
// } from "./action";
// import { APIClient } from "../../helpers/api_helper";
// import {
//   INTERACTION_LIKE,
//   INTERACTION_DISLIKE,
//   INTERACTION_USER_LIKES_BY_ENTITY_NAME,
//   INTERACTION_COUNT_LIKES_BY_ENTITY_RECORD,
//   INTERACTION_GET_LIKE,
//   INTERACTION_GET_COMMENTS,
//   INTERACTION_GET_COMMENTS_RECORD_ID,
//   INTERACTION_ADD_COMMENT,
//   INTERACTION_GET_PARAMETERS,
// } from "../../helpers/url_helper";
//
// const api = new APIClient();
//
// function* addLikeData({ data }) {
//   try {
//     let newLikeData = new FormData();
//     newLikeData.append("recordEntityName", data.recordEntityName);
//     newLikeData.append("recordId", data.recordId);
//     newLikeData.append("authorityId", data.authorityId);
//     newLikeData.append("createdBy", data.createdBy);
//     yield put(LoadingInteractionApi(true));
//     const response = yield call(api.create, INTERACTION_LIKE, newLikeData);
//     yield put(likeApiSuccess(response));
//     yield put(LoadingInteractionApi(false));
//   } catch (error) {
//     yield put(likeApiError(error));
//     yield put(LoadingInteractionApi(false));
//   }
// }
//
// function* getLikeData({ data }) {
//   try {
//     yield put(LoadingInteractionApi(true));
//     const response = yield call(
//       api.get,
//       `${INTERACTION_GET_LIKE}?recordId=${data.recordId}&user=${data.user}&recordEntityName=${data.recordEntityName}`
//     );
//     yield put(getLikeApiSuccess(response));
//     yield put(LoadingInteractionApi(false));
//   } catch (error) {
//     yield put(getLikeApiError(error));
//     yield put(LoadingInteractionApi(false));
//   }
// }
//
// function* dislikeData({ id }) {
//   try {
//     yield put(LoadingInteractionApi(true));
//     const response = yield call(api.delete, `${INTERACTION_DISLIKE}/${id}`);
//     yield put(dislikeApiSuccess(response));
//     yield put(LoadingInteractionApi(false));
//   } catch (error) {
//     yield put(dislikeApiError(error));
//     yield put(LoadingInteractionApi(false));
//   }
// }
//
// function* getUserLikesByEntityNameData({ data }) {
//   try {
//     yield put(LoadingInteractionApi(true));
//     const response = yield call(
//       api.get,
//       `${INTERACTION_USER_LIKES_BY_ENTITY_NAME}?user=${data.user}&recordEntityName=${data.recordEntityName}`
//     );
//     yield put(getUserLikesByEntityNameApiSuccess(response));
//     yield put(LoadingInteractionApi(false));
//   } catch (error) {
//     yield put(getUserLikesByEntityNameApiError(error));
//     yield put(LoadingInteractionApi(false));
//   }
// }
//
// function* countLikesByEntityRecordData({ data }) {
//   try {
//     yield put(LoadingInteractionApi(true));
//     const response = yield call(
//       api.get,
//       `${INTERACTION_COUNT_LIKES_BY_ENTITY_RECORD}?recordId=${data.recordId}&recordEntityName=${data.recordEntityName}`
//     );
//     yield put(countLikesByEntityRecordApiSuccess(response));
//     yield put(LoadingInteractionApi(false));
//   } catch (error) {
//     yield put(countLikesByEntityRecordApiError(error));
//     yield put(LoadingInteractionApi(false));
//   }
// }
//
// function* getCommentsData({ data }) {
//   try {
//     yield put(LoadingInteractionApi(true));
//     const response = yield call(
//       api.get,
//       `${INTERACTION_GET_COMMENTS}?recordEntityName=${data.recordEntityName}`
//     );
//     yield put(getCommentsApiSuccess(response));
//     yield put(LoadingInteractionApi(false));
//   } catch (error) {
//     yield put(getCommentsApiError(error));
//     yield put(LoadingInteractionApi(false));
//   }
// }
//
// function* getCommentsByRecordIdData({ data }) {
//   try {
//     yield put(LoadingInteractionApi(true));
//     const response = yield call(
//       api.get,
//       `${INTERACTION_GET_COMMENTS_RECORD_ID}?recordEntityName=${data.recordEntityName}&recordId=${data.recordId}`
//     );
//     yield put(getCommentsByRecordIdApiSuccess(response));
//     yield put(LoadingInteractionApi(false));
//   } catch (error) {
//     yield put(getCommentsByRecordIdApiError(error));
//     yield put(LoadingInteractionApi(false));
//   }
// }
//
// function* addCommentData({ data }) {
//   try {
//     let _data = new FormData();
//     _data.append("recordEntityName", data.recordEntityName);
//     _data.append("recordId", data.recordId);
//     _data.append("authorityId", data.authorityId);
//     _data.append("comment", data.comment);
//     yield put(LoadingInteractionApi(true));
//     const response = yield call(api.create, INTERACTION_ADD_COMMENT, _data);
//     yield put(saveCommentApiSuccess(response));
//     yield put(LoadingInteractionApi(false));
//   } catch (error) {
//     yield put(saveCommentApiError(error));
//     yield put(LoadingInteractionApi(false));
//   }
// }
//
// function* deleteCommentData({ id }) {
//   try {
//     yield put(LoadingInteractionApi(true));
//     const response = yield call(api.delete, `${INTERACTION_ADD_COMMENT}/${id}`);
//     yield put(deleteCommentsApiSuccess(response));
//     yield put(LoadingInteractionApi(false));
//   } catch (error) {
//     yield put(deleteCommentsApiError(error));
//     yield put(LoadingInteractionApi(false));
//   }
// }
//
// function* getInteractionParametersData() {
//   try {
//     yield put(LoadingInteractionApi(true));
//     const response = yield call(api.get, `${INTERACTION_GET_PARAMETERS}`);
//     yield put(getInteractionParametersApiSuccess(response));
//     yield put(LoadingInteractionApi(false));
//   } catch (error) {
//     yield put(getInteractionParametersApiError(error));
//     yield put(LoadingInteractionApi(false));
//   }
// }
//
// export function* watchLikeData() {
//   yield takeEvery(LIKE_API_REQUEST, addLikeData);
// }
// export function* watchGetLikeData() {
//   yield takeEvery(GET_LIKE_API_REQUEST, getLikeData);
// }
// export function* watchDislikeData() {
//   yield takeEvery(DISLIKE_API_REQUEST, dislikeData);
// }
// export function* watchGetUserLikesByEntityNameData() {
//   yield takeEvery(
//     GET_USER_LIKES_BY_ENTITY_NAME_API_REQUEST,
//     getUserLikesByEntityNameData
//   );
// }
// export function* watchCountLikesByEntityRecordData() {
//   yield takeEvery(
//     COUNT_LIKES_BY_ENTITY_RECORD_API_REQUEST,
//     countLikesByEntityRecordData
//   );
// }
// export function* watchGetCommentsData() {
//   yield takeEvery(GET_COMMENTS_API_REQUEST, getCommentsData);
// }
// export function* watchGetCommentsByRecordIdData() {
//   yield takeEvery(
//     GET_COMMENTS_RECORD_ID_API_REQUEST,
//     getCommentsByRecordIdData
//   );
// }
// export function* watchAddCommentData() {
//   yield takeEvery(SAVE_COMMENT_API_REQUEST, addCommentData);
// }
// export function* watchDeleteCommentData() {
//   yield takeEvery(DELETE_COMMENT_API_REQUEST, deleteCommentData);
// }
// export function* watchgetInteractionParametersData() {
//   yield takeEvery(
//     INTERACTION_PARAMETERS_API_REQUEST,
//     getInteractionParametersData
//   );
// }
//
// function* userInteractionSaga() {
//   yield all([
//     fork(watchLikeData),
//     fork(watchGetLikeData),
//     fork(watchDislikeData),
//     fork(watchGetUserLikesByEntityNameData),
//     fork(watchCountLikesByEntityRecordData),
//     fork(watchGetCommentsData),
//     fork(watchGetCommentsByRecordIdData),
//     fork(watchAddCommentData),
//     fork(watchDeleteCommentData),
//     fork(watchgetInteractionParametersData),
//   ]);
// }
//
// export default userInteractionSaga;

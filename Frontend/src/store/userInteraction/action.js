// import {
//   LIKE_API_SUCCESS,
//   LIKE_API_FAILURE,
//   LIKE_API_REQUEST,
//   GET_LIKE_API_SUCCESS,
//   GET_LIKE_API_FAILURE,
//   GET_LIKE_API_REQUEST,
//   DISLIKE_API_SUCCESS,
//   DISLIKE_API_FAILURE,
//   DISLIKE_API_REQUEST,
//   GET_USER_LIKES_BY_ENTITY_NAME_API_REQUEST,
//   GET_USER_LIKES_BY_ENTITY_NAME_API_SUCCESS,
//   GET_USER_LIKES_BY_ENTITY_NAME_API_FAILURE,
//   COUNT_LIKES_BY_ENTITY_RECORD_API_REQUEST,
//   COUNT_LIKES_BY_ENTITY_RECORD_API_SUCCESS,
//   COUNT_LIKES_BY_ENTITY_RECORD_API_FAILURE,
//   GET_COMMENTS_API_SUCCESS,
//   GET_COMMENTS_API_FAILURE,
//   GET_COMMENTS_API_REQUEST,
//   GET_COMMENTS_RECORD_ID_API_SUCCESS,
//   GET_COMMENTS_RECORD_ID_API_FAILURE,
//   GET_COMMENTS_RECORD_ID_API_REQUEST,
//   SAVE_COMMENT_API_SUCCESS,
//   SAVE_COMMENT_API_FAILURE,
//   SAVE_COMMENT_API_REQUEST,
//   DELETE_COMMENT_API_SUCCESS,
//   DELETE_COMMENT_API_FAILURE,
//   DELETE_COMMENT_API_REQUEST,
//   INTERACTION_PARAMETERS_API_SUCCESS,
//   INTERACTION_PARAMETERS_API_FAILURE,
//   INTERACTION_PARAMETERS_API_REQUEST,
//   INTERACTION_API_LOADING,
// } from "./actionType";
//
// // Like api
//
// export const likeApiRequest = (data) => ({
//   type: LIKE_API_REQUEST,
//   data,
// });
//
// export const likeApiSuccess = (data) => ({
//   type: LIKE_API_SUCCESS,
//   data,
// });
//
// export const likeApiError = (error) => ({
//   type: LIKE_API_FAILURE,
//   payload: { error },
// });
//
// // get Like api
//
// export const getLikeApiRequest = (data) => ({
//   type: GET_LIKE_API_REQUEST,
//   data,
// });
//
// export const getLikeApiSuccess = (data) => ({
//   type: GET_LIKE_API_SUCCESS,
//   data,
// });
//
// export const getLikeApiError = (error) => ({
//   type: GET_LIKE_API_FAILURE,
//   payload: { error },
// });
//
// // Dislike Api
//
// export const dislikeApiRequest = (id) => ({
//   type: DISLIKE_API_REQUEST,
//   id,
// });
//
// export const dislikeApiSuccess = (actionType, data) => ({
//   type: DISLIKE_API_SUCCESS,
//   payload: { actionType, data },
// });
//
// export const dislikeApiError = (actionType, error) => ({
//   type: DISLIKE_API_FAILURE,
//   payload: { actionType, error },
// });
//
// // get user Likes by entity name Api
//
// export const getUserLikesByEntityNameApiRequest = (data) => ({
//   type: GET_USER_LIKES_BY_ENTITY_NAME_API_REQUEST,
//   data,
// });
//
// export const getUserLikesByEntityNameApiSuccess = (data) => ({
//   type: GET_USER_LIKES_BY_ENTITY_NAME_API_SUCCESS,
//   payload: { data },
// });
//
// export const getUserLikesByEntityNameApiError = (error) => ({
//   type: GET_USER_LIKES_BY_ENTITY_NAME_API_FAILURE,
//   payload: { error },
// });
//
// // count_likes_by_entity_record Api
//
// export const countLikesByEntityRecordApiRequest = (data) => ({
//   type: COUNT_LIKES_BY_ENTITY_RECORD_API_REQUEST,
//   data,
// });
//
// export const countLikesByEntityRecordApiSuccess = (data) => ({
//   type: COUNT_LIKES_BY_ENTITY_RECORD_API_SUCCESS,
//   payload: { data },
// });
//
// export const countLikesByEntityRecordApiError = (actionType, error) => ({
//   type: COUNT_LIKES_BY_ENTITY_RECORD_API_FAILURE,
//   payload: { actionType, error },
// });
//
// // get Comment api
//
// export const getCommentsApiRequest = (data) => ({
//   type: GET_COMMENTS_API_REQUEST,
//   data,
// });
//
// export const getCommentsApiSuccess = (data) => ({
//   type: GET_COMMENTS_API_SUCCESS,
//   data,
// });
//
// export const getCommentsApiError = (error) => ({
//   type: GET_COMMENTS_API_FAILURE,
//   payload: { error },
// });
//
// // get Comments by record id api
//
// export const getCommentsByRecordIdApiRequest = (data) => ({
//   type: GET_COMMENTS_RECORD_ID_API_REQUEST,
//   data,
// });
//
// export const getCommentsByRecordIdApiSuccess = (data) => ({
//   type: GET_COMMENTS_RECORD_ID_API_SUCCESS,
//   data,
// });
//
// export const getCommentsByRecordIdApiError = (error) => ({
//   type: GET_COMMENTS_RECORD_ID_API_FAILURE,
//   payload: { error },
// });
//
// // delete Comment api
//
// export const deleteCommentsApiRequest = (id) => ({
//   type: DELETE_COMMENT_API_REQUEST,
//   id,
// });
//
// export const deleteCommentsApiSuccess = (data) => ({
//   type: DELETE_COMMENT_API_SUCCESS,
//   data,
// });
//
// export const deleteCommentsApiError = (error) => ({
//   type: DELETE_COMMENT_API_FAILURE,
//   payload: { error },
// });
//
// // save Comment api
//
// export const saveCommentApiRequest = (data) => ({
//   type: SAVE_COMMENT_API_REQUEST,
//   data,
// });
//
// export const saveCommentApiSuccess = (data) => ({
//   type: SAVE_COMMENT_API_SUCCESS,
//   data,
// });
//
// export const saveCommentApiError = (error) => ({
//   type: SAVE_COMMENT_API_FAILURE,
//   payload: { error },
// });
//
// // Interaction Parameters api
//
// export const getInteractionParametersApiRequest = (data) => ({
//   type: INTERACTION_PARAMETERS_API_REQUEST,
//   data,
// });
//
// export const getInteractionParametersApiSuccess = (data) => ({
//   type: INTERACTION_PARAMETERS_API_SUCCESS,
//   data,
// });
//
// export const getInteractionParametersApiError = (error) => ({
//   type: INTERACTION_PARAMETERS_API_FAILURE,
//   payload: { error },
// });
//
// // loading
//
// export const LoadingInteractionApi = (loading) => ({
//   type: INTERACTION_API_LOADING,
//   loading,
// });

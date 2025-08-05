// import {
//   LIKE_API_SUCCESS,
//   LIKE_API_FAILURE,
//   GET_LIKE_API_SUCCESS,
//   GET_LIKE_API_FAILURE,
//   DISLIKE_API_SUCCESS,
//   DISLIKE_API_FAILURE,
//   GET_USER_LIKES_BY_ENTITY_NAME_API_SUCCESS,
//   GET_USER_LIKES_BY_ENTITY_NAME_API_FAILURE,
//   COUNT_LIKES_BY_ENTITY_RECORD_API_SUCCESS,
//   COUNT_LIKES_BY_ENTITY_RECORD_API_FAILURE,
//   GET_COMMENTS_API_SUCCESS,
//   GET_COMMENTS_API_FAILURE,
//   GET_COMMENTS_RECORD_ID_API_SUCCESS,
//   GET_COMMENTS_RECORD_ID_API_FAILURE,
//   SAVE_COMMENT_API_SUCCESS,
//   SAVE_COMMENT_API_FAILURE,
//   DELETE_COMMENT_API_SUCCESS,
//   DELETE_COMMENT_API_FAILURE,
//   INTERACTION_PARAMETERS_API_SUCCESS,
//   INTERACTION_PARAMETERS_API_FAILURE,
//   INTERACTION_API_LOADING,
// } from "./actionType";
//
// const INIT_STATE = {
//   like: "",
//   likeError: "",
//   dislike: false,
//   dislikeError: "",
//   userLikesByEntityName: [],
//   userLikesByEntityNameError: "",
//   countLikesByEntityRecord: 0,
//   countLikesByEntityRecordError: "",
//   comments: [],
//   commentsError: "",
//   commentsByRecordId: [],
//   commentsByRecordIdError: "",
//   comment: "",
//   commentError: "",
//   interactionParameters: "",
//   interactionParametersError: "",
//   deleteComment: "",
//   deleteCommentError: "",
//   loading: false,
// };
//
// const userInteraction = (state = INIT_STATE, action) => {
//   switch (action.type) {
//     case COUNT_LIKES_BY_ENTITY_RECORD_API_SUCCESS:
//       return {
//         ...state,
//         like: "",
//         countLikesByEntityRecord: action.payload.data,
//       };
//     case COUNT_LIKES_BY_ENTITY_RECORD_API_FAILURE:
//       return {
//         ...state,
//         like: "",
//         countLikesByEntityRecordError: action.payload.error,
//       };
//     case GET_USER_LIKES_BY_ENTITY_NAME_API_SUCCESS:
//       return {
//         ...state,
//         userLikesByEntityName: action.payload.data,
//       };
//     case GET_USER_LIKES_BY_ENTITY_NAME_API_FAILURE:
//       return {
//         ...state,
//         userLikesByEntityNameError: action.payload.error,
//       };
//     case DISLIKE_API_SUCCESS:
//       return {
//         ...state,
//         like: "",
//         dislike: action.data,
//       };
//     case DISLIKE_API_FAILURE:
//       return {
//         ...state,
//         dislikeError: action.payload.error,
//       };
//     case GET_LIKE_API_SUCCESS:
//       return {
//         ...state,
//         like: action.data,
//       };
//     case GET_LIKE_API_FAILURE:
//       return {
//         ...state,
//         likeError: action.payload.error,
//       };
//     case LIKE_API_SUCCESS:
//       return {
//         ...state,
//         like: action.data,
//       };
//     case LIKE_API_FAILURE:
//       return {
//         ...state,
//         likeError: action.payload.error,
//       };
//     case GET_COMMENTS_API_SUCCESS:
//       return {
//         ...state,
//         comments: action.data,
//       };
//     case GET_COMMENTS_API_FAILURE:
//       return {
//         ...state,
//         commentsError: action.payload.error,
//       };
//
//     case GET_COMMENTS_RECORD_ID_API_SUCCESS:
//       return {
//         ...state,
//         commentsByRecordId: action.data,
//       };
//     case GET_COMMENTS_RECORD_ID_API_FAILURE:
//       return {
//         ...state,
//         commentsByRecordIdError: action.payload.error,
//       };
//
//     case SAVE_COMMENT_API_SUCCESS:
//       return {
//         ...state,
//         comment: action.data,
//       };
//     case SAVE_COMMENT_API_FAILURE:
//       return {
//         ...state,
//         commentError: action.payload.error,
//       };
//     case DELETE_COMMENT_API_SUCCESS:
//       return {
//         ...state,
//         deleteComment: action.data,
//       };
//     case DELETE_COMMENT_API_FAILURE:
//       return {
//         ...state,
//         deleteCommentError: action.payload.error,
//       };
//     case INTERACTION_PARAMETERS_API_SUCCESS:
//       return {
//         ...state,
//         interactionParameters: action.data,
//       };
//     case INTERACTION_PARAMETERS_API_FAILURE:
//       return {
//         ...state,
//         interactionParametersError: action.payload.error,
//       };
//     case INTERACTION_API_LOADING:
//       return {
//         ...state,
//         loading: action.loading,
//       };
//     default:
//       return state;
//   }
// };
// export default userInteraction;

import {
  API_ERROR,
  LOGIN_SUCCESS,
  LOGIN_USER,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  RESET_LOGIN_FLAG,
} from "./actionTypes";

const initialState = {
  errorMsg: "",
  loading: false,
  error: false,
  roles: [],
  permissions: [],
  user: null,
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
        error: false,
      };
    case LOGIN_SUCCESS:
      console.log("payload : " + JSON.stringify(action.payload));
      console.log("payload fullName: " + action.payload.fullName);
      return {
        ...state,
        loading: false,
        error: false,
        roles: action?.payload?.roles,
        permissions: action?.payload?.permissions,
        user: action.payload,
      };
    case LOGOUT_USER:
      return { ...state, isUserLogout: false };

    case LOGOUT_USER_SUCCESS:
      return { ...state, isUserLogout: true };
    case API_ERROR:
      return {
        ...state,
        errorMsg: action.payload.data,
        loading: true,
        error: true,
        isUserLogout: false,
      };
    case RESET_LOGIN_FLAG:
      return{
        ...state,
        errorMsg: null,
        loading: false,
        error: false,
      };
    default:
      return state;
  }
};

export default LoginReducer;

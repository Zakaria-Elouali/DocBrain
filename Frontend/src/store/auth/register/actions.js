import {
  REGISTER_USER,
  REGISTER_USER_FAILED,
  REGISTER_USER_SUCCESSFUL,
  RESET_REGISTER_FLAG,
} from "./actionTypes";

export const registerUser = (user, callback) => {
  return {
    type: REGISTER_USER,
    payload: { user, callback },
  };
};


export const registerUserSuccessful = (user) => {
  return {
    type: REGISTER_USER_SUCCESSFUL,
    payload: user,
  };
};

export const registerUserFailed = (user) => {
  return {
    type: REGISTER_USER_FAILED,
    payload: user,
  };
};

export const resetRegisterFlag = () => {
  return {
    type: RESET_REGISTER_FLAG,
  };
};

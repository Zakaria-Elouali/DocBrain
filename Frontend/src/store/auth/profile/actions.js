import { PROFILE_ERROR } from "./actionTypes";

export const profileError = (error) => {
  return {
    type: PROFILE_ERROR,
    payload: error,
  };
};

import { GET_ENUMS, GET_ENUMS_SUCCESS } from "./actiontype";

export const getEnums = (actionType, data) => ({
  type: GET_ENUMS,
  payload: { actionType, data },
});

export const getEnumsSuccees = (actionType, data) => ({
  type: GET_ENUMS_SUCCESS,
  payload: { actionType, data },
});

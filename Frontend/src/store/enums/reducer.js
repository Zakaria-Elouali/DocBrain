import { GET_ENUMS, GET_ENUMS_SUCCESS } from "./actiontype";

const INIT_STATE = {
  enums: [],
};

const Enums = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ENUMS_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ENUMS:
          return {
            ...state,
            enums: action.payload.data,
          };

        default:
          return { ...state };
      }
    default:
      return { ...state };
  }
};

export default Enums;

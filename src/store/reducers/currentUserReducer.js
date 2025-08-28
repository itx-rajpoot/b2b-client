import { SET_CURRENT_USER } from "../actionTypes";

const INITIAL_STATE = {
  isAuthenticated: false,
  isAdmin: false,
  id: null
};

export default function currentUserReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        isAuthenticated: true,
        isAdmin: action.isAdmin,
        id: action.id,
      };
    default:
      return state;
  }
}

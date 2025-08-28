import { LOAD_VENUE } from "../actionTypes";

const INITIAL_STATE = null;

export default function venueReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOAD_VENUE:
      return action.venue
    default:
      return state;
  }
}

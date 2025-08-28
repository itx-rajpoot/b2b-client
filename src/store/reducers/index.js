import { combineReducers } from 'redux';
import currentUser from './currentUserReducer';
import venue from './venueReducer';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import { USER_LOGOUT } from '../actionTypes';

const appReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  currentUser,
  venue,
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;

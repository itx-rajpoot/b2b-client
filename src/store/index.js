import rootReducer from './reducers/index';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createFirestoreInstance } from 'redux-firestore';
import { getFirebase } from 'react-redux-firebase';
import firebase from '../services/firebase';


export const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument(getFirebase)),
    process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
  )
);

const rrfConfig = {
  userProfile: 'venues',
  useFirestoreForProfile: true
}

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}
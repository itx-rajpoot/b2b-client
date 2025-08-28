import { setTokenHeader } from '../../services/api';
import { SET_CURRENT_USER, USER_LOGOUT } from '../actionTypes';
import firebase from '../../services/firebase';

export function setCurrentUser(id, isAdmin) {
  return {
    type: SET_CURRENT_USER,
    id,
    isAdmin,
  };
}

export function setAuthorizationToken(token) {
  setTokenHeader(token);
}

export function logoutUser() {
  return {
    type: USER_LOGOUT,
  };
}

export function logout() {
  return (dispatch) => {
    firebase.auth().signOut()
      .then(() =>{
        dispatch(logoutUser());
        setAuthorizationToken(false);
      });
  };
}

export function loginVenue(email, password) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log('Firebase user logged in:', user);
          console.log('Checking if the user is a venue');
  
          firebase
            .auth()
            .currentUser.getIdTokenResult()
            .then(async (idTokenResult) => {
              if (idTokenResult.claims.venue || idTokenResult.claims.admin) {
                dispatch(setCurrentUser(user.uid, idTokenResult.claims.admin));
                const token = await user.getIdToken();
                setAuthorizationToken(token);
                window.localStorage.setItem("email", email);
                resolve(user);
              } else {
                firebase.auth().signOut();
                reject({ message: 'Only venues are allowed to log in' });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
};

export function loginVenueWithCustomToken(customToken) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      return firebase
        .auth()
        .signInWithCustomToken(customToken)
        .then(async (userCredential) => {
          const user = userCredential.user;
          console.log('Firebase user team_logged in:', user);
          const token = await user.getIdToken();
          setAuthorizationToken(token);
          dispatch(setCurrentUser(user.uid));
          resolve(user);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
};

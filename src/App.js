import { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './App.less';
import Main from './Main';
import Auth from './containers/Auth/AuthMain';
import { useEffect } from 'react';
import firebase from './services/firebase';
import { setAuthorizationToken, setCurrentUser } from './store/actions/auth';
import AdminMain from './AdminMain';

function App() {
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe;
    const verifySession = async () => {
      console.log('User onAuthStateChanged');
      unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if(!loading) return;
        if (user) {
          console.log('User on session', user.email, user.uid);
          user
            .getIdTokenResult()
            .then((idTokenResult) => {
              if (idTokenResult.claims.venue || idTokenResult.claims.admin) {
                console.log(idTokenResult.claims.venue ? 'is a Restaurant' : 'is admin');
                dispatch(setCurrentUser(user.uid, idTokenResult.claims.admin));
                setAuthorizationToken(idTokenResult.token);
                setLoading(false);
              } else {
                console.log('not a venue');
                setLoading(false);
              }
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
            });
        } else {
          console.log('No user session');
          setLoading(false);
        }
      });
    };
    verifySession();
    return function cleanup() {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="dinego-loading-page">
        <div>
          <div />
          <div />
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route 
        exact 
        path={['/login/:token_id', '/login', '/signup', '/forgot-password', '/reset-password/:token_id', '/confirmation/:token_id']}
        component={Auth}
      />
      <Route path="/">
        {currentUser.isAuthenticated && currentUser.isAdmin
          ? <AdminMain /> 
          : currentUser.isAuthenticated && !currentUser.isAdmin
            ? <Main /> 
            : <Redirect to="/login" />
        }
      </Route>
      <Redirect to="/" />
    </Switch>
  );
}

export default App;

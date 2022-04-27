import {Card} from 'react-bootstrap';
import {Navigate, Route, Routes, useLocation, Link} from 'react-router-dom';
import Login from '../components/Login';
import styles from './Welcome.module.css';
import SignUp from '../components/SignUp';
import {useDispatch} from 'react-redux';
import {authActions} from '../store/auth-slice';
import {useCallback, useEffect} from 'react';
import useHttp from '../hooks/use-http';

const Welcome = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const isLogin = location.pathname === '/login';
  
  const buttonText = isLogin
    ? `Don't have an account? Create one.`
    : `Already have an account? Log in.`;
  
  const redirectLink = isLogin ? 'signup' : 'login';
  
  const requestFunction = useCallback(async (initParams) => {
    const endpoint = isLogin ? 'login' : 'signup';
    const response = await fetch(`/api/auth/${endpoint}`, {
      method: 'POST',
      body: initParams.body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': initParams.contentType || ''
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errorText || 'Failed to authorize.');
    }
    
    return {
      token: data.token,
      role: data.role
    };
  }, [isLogin]);
  
  const {
    sendRequest,
    clearRequest,
    error,
    status,
    data
  } = useHttp(requestFunction);
  
  const signUpHandler = async (formData) => {
    sendRequest(formData);
  };
  
  const loginHandler = (body) => {
    sendRequest(body);
  };
  
  useEffect(() => {
    if (status === 'completed' && !error) {
      dispatch(authActions.login(data));
    }
  }, [dispatch, status, error]);
  
  return (
    <Card className={styles.card}>
      <Card.Body>
        <Routes>
          <Route path='login' element=
            {<Login
              onSubmit={loginHandler}
              onReset={clearRequest}
              status={status}
              error={error}
            />}
          />
          <Route path='signup' element=
            {<SignUp
              onSubmit={signUpHandler}
              onReset={clearRequest}
              status={status}
              error={error}
            />}
          />
          <Route path='*' element={<Navigate to='login' />} />
        </Routes>
        <div className={styles.link}>
          <Link to={redirectLink}>{buttonText}</Link>
        </div>
      </Card.Body>
    </Card>
    
  );
};

export default Welcome;
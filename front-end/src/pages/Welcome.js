import {Card} from 'react-bootstrap';
import {Navigate, Route, Routes, useLocation, Link} from 'react-router-dom';
import Login from '../components/Login';
import styles from './Welcome.module.css';
import SignUp from '../components/SignUp';
import {useDispatch} from 'react-redux';
import {authActions} from '../store/auth-slice';
import {useCallback} from 'react';
import useHttp from '../hooks/use-http';

const Welcome = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const isLogin = location.pathname === '/login';
  
  const buttonText = isLogin
    ? `Don't have an account? Create one.`
    : `Already have an account? Log in.`;
  
  const redirectLink = isLogin ? 'signup' : 'login';
  
  const requestFunction = useCallback(async (body) => {
    const method = isLogin ? 'login' : 'signup';
    const response = await fetch(`/api/auth/${method}`, {
      method: 'POST',
      body,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errorText || 'Failed to authorize.');
    }
    
    return data.token;
  }, [isLogin]);
  
  const {
    sendRequest,
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
  
  if (status === 'completed' && !error) {
    dispatch(authActions.login(data));
  }
  
  return (
    <Card className={styles.card}>
      <Card.Body>
        <Routes>
          <Route path='login' element={<Login onSubmit={loginHandler} />} />
          <Route path='signup' element={<SignUp onSubmit={signUpHandler} />} />
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
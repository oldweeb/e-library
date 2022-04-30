import styles from './Login.module.css';
import {Form, Overlay, Tooltip} from 'react-bootstrap';
import {useState, useEffect, useRef} from 'react';

const Login = (props) => {
  const {status, error} = props;
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [, updateState] = useState();
  
  useEffect(() => {
    if (status === 'completed' && !error) {
      emailInputRef.current.classList.add('is-invalid');
      passwordInputRef.current.classList.add('is-invalid');
    }
  }, [error, status]);
  
  const submitHandler = (event) => {
    event.preventDefault();
    
    let isInvalid = false;
    
    if (emailInputRef.current.value === '') {
      isInvalid = true;
      emailInputRef.current.classList.add('is-invalid');
    }
    
    if (passwordInputRef.current.value === '') {
      isInvalid = true;
      passwordInputRef.current.classList.add('is-invalid');
    }
    
    if (isInvalid) {
      updateState(Math.random());
      return;
    }
    
    props.onSubmit({
      body: JSON.stringify({
        email: emailInputRef.current.value,
        password: passwordInputRef.current.value
      }),
      contentType: 'application/json'
    });
  };
  
  const inputFocusHandler = (event) => {
    event.target.classList.remove('is-invalid');
  };
  
  return (
    <Form className={styles.login} onSubmit={submitHandler}>
      <Form.Group controlId='email'>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          onFocus={inputFocusHandler}
          ref={emailInputRef}
          type='email'
          placeholder='test@domain.com'
          name='email'
        />
        <Overlay
          target={emailInputRef}
          placement='right'
          show={!!error || emailInputRef.current?.classList.contains('is-invalid')}
        >
          <Tooltip>
            {!!error
              ? 'Failed to verify your data. Check out your email and try again.'
              : 'Email must not be empty.'}
          </Tooltip>
        </Overlay>
      </Form.Group>
      <Form.Group controlId='password'>
        <Form.Label>Password</Form.Label>
        <Form.Control
          onFocus={inputFocusHandler}
          ref={passwordInputRef}
          type='password'
          placeholder='password'
          name='password'
        />
        <Overlay
          target={passwordInputRef}
          placement='right'
          show={!!error || passwordInputRef.current?.classList.contains('is-invalid')}
        >
          <Tooltip>
            {!!error
              ? 'Check out your email and try again.'
              : 'Password must not be empty.'}
          </Tooltip>
        </Overlay>
      </Form.Group>
      <Form.Group controlId='submit'>
        <Form.Control
          type='submit'
          value={status === 'pending' ? 'Sending request...' : 'Login'}
          disabled={status === 'pending'}
        />
      </Form.Group>
    </Form>
  );
};

export default Login;
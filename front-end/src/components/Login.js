import {useReducer} from 'react';
import styles from './Login.module.css';
import {Form} from 'react-bootstrap';

const INITIAL_INPUT_STATE = {
  value: '',
  isValid: null
};

const emailReducer = (state, action) => {
  if (action.type === 'INPUT_CHANGE') {
    return {value: action.value, isValid: action.value.includes('@')};
  }
  
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value, isValid: state.value.includes('@')}
  }
  
  return INITIAL_INPUT_STATE;
};

const passwordReducer = (state, action) => {
  if (action.type === 'INPUT_CHANGE') {
    return {value: action.value, isValid: action.value.length > 0};
  }
  
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value, isValid: state.value.length > 0};
  }
  
  return INITIAL_INPUT_STATE;
};

const Login = (props) => {
  const [emailState, dispatchEmail] = useReducer(emailReducer, INITIAL_INPUT_STATE);
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, INITIAL_INPUT_STATE);
  
  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'INPUT_CHANGE', value: event.target.value});
  };
  
  const validateEmail = () => {
    dispatchEmail({type: 'INPUT_BLUR'});
  };
  
  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'INPUT_CHANGE', value: event.target.value});
  };
  
  const validatePassword = () => {
    dispatchPassword({type: 'INPUT_BLUR'});
  }
  
  const submitHandler = (event) => {
    event.preventDefault();
    props.onSubmit(
      JSON.stringify({email: emailState.value, password: passwordState.value})
    );
  };
  
  const emailClasses = `${(emailState.isValid === false) && 'is-invalid'}`;
  const passwordClasses = `${(passwordState.isValid === false) && 'is-invalid'}`;
  
  return (
    <Form className={styles.login} onSubmit={submitHandler}>
      <Form.Group controlId='email'>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          className={emailClasses}
          type='email'
          placeholder='test@domain.com'
          name='email'
          onChange={emailChangeHandler}
          onBlur={validateEmail}
        />
      </Form.Group>
      <Form.Group controlId='password'>
        <Form.Label>Password</Form.Label>
        <Form.Control
          className={passwordClasses}
          type='password'
          placeholder='password'
          name='password'
          onChange={passwordChangeHandler}
          onBlur={validatePassword}
        />
      </Form.Group>
      <Form.Group controlId='submit'>
        <Form.Control
          type='submit'
          value='Login'
          disabled={!(emailState.isValid && passwordState.isValid)}
        />
      </Form.Group>
    </Form>
  );
};

export default Login;
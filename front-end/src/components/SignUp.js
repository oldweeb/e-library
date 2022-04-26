import {useReducer} from 'react';
import {Form} from 'react-bootstrap';
import styles from './SignUp.module.css';

const INITIAL_EMAIL_STATE = {
  value: '',
  isValid: null
};

const INITIAL_PASSWORD_STATE = {
  password: '',
  confirmedPassword: '',
  isValid: null
};

const emailReducer = (state, action) => {
  if (action.type === 'INPUT_CHANGE') {
    return {value: action.value, isValid: action.value.includes('@')};
  }
  
  if (action.type === 'INPUT_BLUR') {
    return {value: state.value, isValid: state.value.includes('@')};
  }
  
  return INITIAL_EMAIL_STATE;
};

const passwordReducer = (state, action) => {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=|\\,./?])[A-Za-z0-9!@#$%^&*()_\-+=|\\,./?]{8,}$/i;
  
  if (action.type === 'INPUT_CHANGE') {
    return {
      password: action.value,
      confirmedPassword: state.confirmedPassword,
      isValid: action.value.length >= 8
        && action.value.search(passwordPattern) >= 0
        && action.value === state.confirmedPassword
    }
  }
  
  if (action.type === 'INPUT_CONFIRM_CHANGE') {
    return {
      password: state.password,
      confirmedPassword: action.value,
      isValid: state.password.length >= 8
        && state.password.search(passwordPattern) >= 0
        && action.value === state.password
    }
  }
  
  if (action.type === 'INPUT_BLUR') {
    return {
      password: state.password,
      confirmedPassword: state.confirmedPassword,
      isValid: state.password.length >= 8
        && state.password.search(passwordPattern) >= 0
        && state.confirmedPassword === state.password
    }
  }
  
  return INITIAL_PASSWORD_STATE;
};

const SignUp = (props) => {
  const [emailState, dispatchEmail] = useReducer(emailReducer, INITIAL_EMAIL_STATE);
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, INITIAL_PASSWORD_STATE);
  
  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'INPUT_CHANGE', value: event.target.value});
  };
  
  const validateEmail = () => {
    dispatchEmail({type: 'INPUT_BLUR'});
  };
  
  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'INPUT_CHANGE', value: event.target.value});
  };
  
  const confirmPasswordChangeHandler = (event) => {
    dispatchPassword({type: 'INPUT_CONFIRM_CHANGE', value: event.target.value});
  };
  
  const validatePassword = () => {
    dispatchPassword({type: 'INPUT_BLUR'});
  };
  
  const submitHandler = (event) => {
    event.preventDefault();
    props.onSubmit({
      body: new FormData(event.target)
    })
  };
  
  const emailClasses = `${(emailState.isValid === false) && 'is-invalid'}`;
  const passwordClasses = `${(passwordState.isValid === false) && 'is-invalid'}`;
  
  const disabled = !(emailState.isValid && passwordState.isValid)
                    || props.status === 'pending';
  
  const submitButtonText = props.status === 'pending' ? 'Sending request...' : 'Sign Up';
  
  return (
    <Form onSubmit={submitHandler} className={styles.signup}>
      <Form.Group controlId='email'>
        <Form.Label>Email Address</Form.Label>
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
      <Form.Group controlId='password-confirm'>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          className={passwordClasses}
          type='password'
          placeholder='password'
          onChange={confirmPasswordChangeHandler}
          onBlur={validatePassword}
        />
      </Form.Group>
      <Form.Group controlId='avatar'>
        <Form.Label>Choose Your Avatar (not required)</Form.Label>
        <Form.Control
          type='file'
          name='avatar'
          accept='.jpg,.png,.jpeg,.bmp'
        />
      </Form.Group>
      <Form.Group controlId='submit'>
        <Form.Control
          type='submit'
          value={submitButtonText}
          disabled={disabled}
        />
      </Form.Group>
    </Form>
  );
};

export default SignUp;

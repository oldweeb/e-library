import {Form, Overlay, Tooltip} from 'react-bootstrap';
import styles from './SignUp.module.css';
import {useRef, useState} from 'react';

const SignUp = (props) => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmInputRef = useRef();
  
  const {status, error} = props;
  
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
    
    if (confirmInputRef.current.value === '') {
      isInvalid = true;
      confirmInputRef.current.classList.add('is-invalid');
    }
    
    if (passwordInputRef.current.value !== confirmInputRef.current.value) {
      isInvalid = true;
      passwordInputRef.current.classList.add('is-invalid');
      confirmInputRef.current.classList.add('is-invalid');
    }
    
    if (isInvalid) {
      return;
    }
    
    const formData = new FormData(event.target);
    
    props.onSubmit({
      body: formData
    });
  };
  
  const inputFocusHandler = (event) => {
    event.target.classList.remove('is-invalid');
  };
  
  return (
    <Form onSubmit={submitHandler} className={styles.signup}>
      <Form.Group controlId='email'>
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          onFocus={inputFocusHandler}
          ref={emailInputRef}
          type='email'
          placeholder='test@domain.com'
          name='email'
        />
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
      </Form.Group>
      <Form.Group controlId='password-confirm'>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          onFocus={inputFocusHandler}
          ref={confirmInputRef}
          type='password'
          placeholder='password'
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
          value={status === 'pending' ? 'Sending request...' : 'Sign Up'}
          disabled={status === 'pending'}
        />
      </Form.Group>
    </Form>
  );
};

export default SignUp;

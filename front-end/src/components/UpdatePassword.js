import {Form, Card, Button, Overlay, Tooltip, Modal} from 'react-bootstrap';
import styles from './UpdatePassword.module.css';
import {useRef, useState} from 'react';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=|\\,./?])[A-Za-z0-9!@#$%^&*()_\-+=|\\,./?]{8,}$/i;

const UpdatePassword = (props) => {
  const {submitHandler, requestInfo} = props;
  const [newPasswordState, setNewPasswordState] = useState({
    isValid: null,
    match: null
  });
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  
  const oldPasswordFocusHandler = () => {
    if (requestInfo.error) {
      requestInfo.clearRequest();
    }
  };
  
  const passwordInputFocusHandler = () => {
    setNewPasswordState(prevState => {
      return {
        isValid: null,
        match: prevState.match
      };
    });
  };
  
  const resetHandler = () => {
    requestInfo.clearRequest();
    oldPasswordRef.current.value = '';
    newPasswordRef.current.value = '';
    confirmPasswordRef.current.value = '';
  };
  
  const formSubmitHandler = (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    
    if (password.search(passwordRegex) < 0) {
      setNewPasswordState((prevState) => {
        return {
          isValid: false,
          match: prevState.match
        };
      });
      
      return;
    }
    
    const confirm = event.target.confirm.value;
    if (password !== confirm) {
      setNewPasswordState((prevState) => {
        return {
          isValid: prevState.isValid,
          match: false
        };
      });
      
      return;
    }
    
    setNewPasswordState({
      isValid: null,
      match: null
    });
    submitHandler(event);
  };
  
  return (
    <>
      <Modal
        size='sm'
        show={requestInfo.status === 'completed' && !requestInfo.error}
        onHide={resetHandler}
      >
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Password was successfully updated.
        </Modal.Body>
      </Modal>
      <Card>
        <Card.Body>
          <Form className={styles.form} onSubmit={formSubmitHandler}>
            <Form.Group controlId='password-old'>
              <Form.Label>Old password:</Form.Label>
              <Form.Control
                ref={oldPasswordRef}
                isInvalid={!!requestInfo.error}
                type='password'
                placeholder='old password'
                name='old'
                onFocus={oldPasswordFocusHandler}
              />
              <Overlay
                placement='right'
                show={!!requestInfo.error}
                target={oldPasswordRef.current}
              >
                <Tooltip>Check old password and try again.</Tooltip>
              </Overlay>
            </Form.Group>
            <Form.Group controlId='password'>
              <Form.Label>New password:</Form.Label>
              <Form.Control
                type='password'
                placeholder='password'
                name='password'
                ref={newPasswordRef}
                onFocus={passwordInputFocusHandler}
                isInvalid={
                  newPasswordState.isValid === false || newPasswordState.match === false
                }
              />
              <Overlay
                target={newPasswordRef.current}
                placement='right'
                show={newPasswordState.isValid === false}
              >
                <Tooltip>Password must match pattern.</Tooltip>
              </Overlay>
            </Form.Group>
            <Form.Group controlId='password-confirm'>
              <Form.Label>Confirm your password:</Form.Label>
              <Form.Control
                type='password'
                placeholder='confirmed password'
                name='confirm'
                ref={confirmPasswordRef}
                isInvalid={newPasswordState.match === false}
              />
              <Overlay
                target={newPasswordRef.current}
                placement='right'
                show={newPasswordState.match === false}
              >
                <Tooltip>Passwords do not match.</Tooltip>
              </Overlay>
            </Form.Group>
            <Button
              type='submit'
              variant='outline-primary'
              disabled={requestInfo.status === 'pending'}
            >
              Update Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default UpdatePassword;
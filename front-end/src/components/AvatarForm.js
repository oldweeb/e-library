import {useRef, useState} from 'react';
import styles from './AvatarForm.module.css';
import {Button, Card, Form} from 'react-bootstrap';

const AvatarForm = (props) => {
  const inputRef = useRef();
  const [inputIsValid, setInputIsValid] = useState();
  const {submitHandler} = props;
  
  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (inputRef.current.files.length === 0) {
      setInputIsValid(false);
      return;
    }
    
    submitHandler(event);
    inputRef.current.value = '';
  };
  
  const avatarChangedHandler = (event) => {
    setInputIsValid(true);
  };
  
  return (
    <Card className={styles.card}>
      <Card.Body>
        <Form onSubmit={onSubmitHandler} className={styles['form']}>
          <Form.Group controlId='avatar'>
            <Form.Label>Choose your avatar</Form.Label>
            <Form.Control
              type='file'
              name='avatar'
              ref={inputRef}
              isInvalid={inputIsValid === false}
              onChange={avatarChangedHandler}
              accept='.jpg,.png,.jpeg,.bmp'
            />
          </Form.Group>
          <Button variant='outline-primary' type='submit'>Update Avatar</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AvatarForm;
import {useSelector} from 'react-redux';
import {Button, Card, Form, Modal, Overlay, Tooltip} from 'react-bootstrap';
import styles from './Upload.module.css';
import useHttp from '../hooks/use-http';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Navigate} from 'react-router-dom';

const Upload = (props) => {
  const {token} = useSelector(state => state.auth);
  const titleInputRef = useRef();
  const descriptionInputRef = useRef();
  const imageInputRef = useRef();
  const contentInputRef = useRef();
  
  const requestFunction = useCallback(async (formData) => {
    const response = await fetch('/api/books', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload book.');
    }
  }, [token])
  
  const {
    sendRequest,
    status,
    error,
    clearRequest
  } = useHttp(requestFunction);
  
  const submitHandler = (event) => {
    event.preventDefault();
    
    let isInvalid = false;
    
    if (titleInputRef.current.value.length < 3) {
      isInvalid = true;
      titleInputRef.current.classList.add('is-invalid');
    }
    
    if (descriptionInputRef.current.value.length < 3) {
      isInvalid = true;
      descriptionInputRef.current.classList.add('is-invalid');
    }
    
    if (imageInputRef.current.files.length === 0) {
      isInvalid = true;
      imageInputRef.current.classList.add('is-invalid');
    }
    
    if (contentInputRef.current.files.length === 0) {
      isInvalid = true;
      contentInputRef.current.classList.add('is-invalid');
    }
    
    if (isInvalid) {
      return;
    }
    
    sendRequest(new FormData(event.target));
  };
  
  const inputFocusHandler = (event) => {
    event.target.classList.remove('is-invalid');
  };
  
  if (status === 'completed' && !error) {
    return <Navigate to='/' />;
  }
  
  return (
    <>
      <Modal show={!!error} onHide={clearRequest}>
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Failed to upload the book.</p>
        </Modal.Body>
      </Modal>
      <Card className={styles.container}>
        <Card className={styles['container-body']}>
          <Card.Body>
            <Form className={styles.form} onSubmit={submitHandler}>
              <Form.Group controlId='title'>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  name='title'
                  type='text'
                  minLength={3}
                  maxLength={25}
                  ref={titleInputRef}
                  onFocus={inputFocusHandler}
                />
                <Overlay
                  target={titleInputRef}
                  placement='right'
                  show={!!error && titleInputRef.current.classList.contains('is-invalid')}
                >
                  <Tooltip>Title must be of length 3..25</Tooltip>
                </Overlay>
              </Form.Group>
              <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  name='description'
                  rows={5}
                  as='textarea'
                  minLength={3}
                  maxLength={999}
                  ref={descriptionInputRef}
                  onFocus={inputFocusHandler}
                />
                <Overlay
                  target={descriptionInputRef}
                  placement='right'
                  show={!!error && descriptionInputRef.current.classList.contains('is-invalid')}
                >
                  <Tooltip>Description must be of length 3..999</Tooltip>
                </Overlay>
              </Form.Group>
              <Form.Group controlId='image'>
                <Form.Label>Main Image</Form.Label>
                <Form.Control
                  name='mainImage'
                  type='file'
                  accept='.jpg,.png,.jpeg,.bmp'
                  ref={imageInputRef}
                  onFocus={inputFocusHandler}
                />
                <Overlay
                  target={imageInputRef}
                  placement='right'
                  show={!!error && imageInputRef.current.classList.contains('is-invalid')}
                >
                  <Tooltip>Main Image field is required.</Tooltip>
                </Overlay>
              </Form.Group>
              <Form.Group controlId='content'>
                <Form.Label>Content</Form.Label>
                <Form.Control
                  name='content'
                  type='file'
                  accept='.pdf'
                  ref={contentInputRef}
                  onFocus={inputFocusHandler}
                />
                <Overlay
                  target={contentInputRef}
                  placement='right'
                  show={!!error && contentInputRef.current.classList.contains('is-invalid')}
                >
                  <Tooltip>Content field is required.</Tooltip>
                </Overlay>
              </Form.Group>
              <Button
                variant='outline-primary'
                disabled={status === 'pending'}
                type='submit'
              >
                Upload
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Card>
    </>
  );
};

export default Upload;
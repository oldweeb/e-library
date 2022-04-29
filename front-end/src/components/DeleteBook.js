import {useSelector} from 'react-redux';
import {useCallback} from 'react';
import useHttp from '../hooks/use-http';
import {Navigate} from 'react-router-dom';
import {Button, Modal} from 'react-bootstrap';

const DeleteBook = (props) => {
  const {id} = props;
  const {token} = useSelector(state => state.auth);
  
  const deleteBookRequest = useCallback(async () => {
    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Couldn't delete book.`);
    }
  }, [id, token]);
  
  const {
    sendRequest,
    status,
    error,
    clearRequest
  } = useHttp(deleteBookRequest);
  
  if (status === 'completed' && !error) {
    return <Navigate to='/' />;
  }
  
  const deleteHandler = () => {
    sendRequest();
  };
  
  return (
    <>
      <Modal onHide={() => clearRequest()} show={!!error}>
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Failed to delete book.</p>
        </Modal.Body>
      </Modal>
      <Button
        variant='danger'
        onClick={deleteHandler}
        disabled={status === 'pending'}
        className={props.className}
      >
        Delete
      </Button>
    </>
  );
};

export default DeleteBook;
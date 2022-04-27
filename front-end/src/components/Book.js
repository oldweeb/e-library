import useHttp from '../hooks/use-http';
import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Image, Placeholder, Card} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWarning} from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import styles from './Book.module.css';

const Book = (props) => {
  const {id} = props;
  const token = useSelector(state => state.auth.token);
  const [imgUrl, setImgUrl] = useState();
  
  const requestFunction = useCallback(async () => {
    const response = await fetch(`/api/books/${id}/mainImage`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch book\'s main image.');
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }, [id, token]);
  
  const {
    sendRequest,
    clearRequest,
    status,
    error,
    data
  } = useHttp(requestFunction);
  
  useEffect(() => {
    sendRequest();
  }, []);
  
  useEffect(() => {
    if (status === 'completed' && !!data) {
      setImgUrl(data);
    }
  }, [data]);
  
  let imgContent;
  
  if (status === 'pending') {
    imgContent = <Placeholder animation='glow' as='span'  />;
  }
  
  if (status === 'completed' && !!data) {
    imgContent = (
      <Image
        src={imgUrl}
        style={{width: '10rem', height: '15rem'}}
        draggable={false}
        fluid
        rounded
        alt='Book main image.'
      />
    );
  }
  
  if (status === 'completed' && error) {
    imgContent = (
      <FontAwesomeIcon icon={faWarning} />
    );
  }
  
  return (
    <li key={id}>
      <Card className='bg-dark'>
        <Card.Body className={styles.book}>
          {imgContent}
          <Link to={`/books/${id}`}>{props.title}</Link>
        </Card.Body>
      </Card>
    </li>
  );
};

export default Book;
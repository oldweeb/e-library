import {Card, Placeholder, Spinner, Image} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import styles from './Book.module.css';
import {useCallback, useEffect} from 'react';
import useHttp from '../hooks/use-http';
import {useSelector} from 'react-redux';
import DownloadBook from '../components/DownloadBook';
import NoBooksFound from '../components/NoBooksFound';
import DeleteBook from '../components/DeleteBook';

const Book = (props) => {
  const {id} = useParams();
  const {token, role} = useSelector(state => state.auth);
  
  const getBookRequest = useCallback(async () => {
    const response = await fetch(`/api/books/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to find book by id.');
    }
    
    return await response.json();
  }, [id, token]);
  
  const getImageRequest = useCallback(async () => {
    const response = await fetch(`/api/books/${id}/mainImage`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch main image.');
    }
    
    const image = await response.blob();
    return URL.createObjectURL(image);
  }, [id, token]);
  
  const {
    sendRequest: getBook,
    status: bookStatus,
    error: bookError,
    data: book
  } = useHttp(getBookRequest);
  
  const {
    sendRequest: getImage,
    status: imageStatus,
    error: imageError,
    data: imageUrl
  } = useHttp(getImageRequest);
  
  useEffect(() => {
    getBook();
    getImage();
  }, [getBook, getImage]);
  
  let bookContent, imageContent;
  
  if (bookStatus === 'pending') {
    bookContent = (
      <Spinner animation='border' role='search' size='lg'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    );
  }
  
  if (bookStatus === 'completed' && !bookError) {
    bookContent = (
      <>
        <h2 className={styles.title}>{book.title}</h2>
        <p className={styles.description}>{book.description}</p>
      </>
    );
  }
  
  if (imageStatus === 'pending') {
    imageContent = (
      <Placeholder className={styles.mainImage}
        bg='light'
        animation='glow'
        as='span'
        style={{width: '16rem', height: '24rem' }}
      />
    );
  }
  
  if (imageStatus === 'completed' && !imageError) {
    imageContent = (
      <Image
        className={styles['main-image']}
        src={imageUrl}
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '36rem',
          maxHeight: '24rem',
          minWidth: '12rem',
          minHeight: '12rem'
        }}
        draggable={false}
        fluid
        rounded
        thumbnail
        alt='Main Image'
      />
    );
  }
  
  const cardClassName = !bookError
    ? styles.container
    : `${styles.container} ${styles['not-found']}`;
  
  const cardBodyClassName = !bookError
    ? styles['container-body']
    : `${styles['container-body']} ${styles['not-found']}`;
  
  return (
    <Card className={cardClassName}>
      <Card.Body className={cardBodyClassName}>
        {!!bookError && <NoBooksFound />}
        {!bookError && (
          <>
            {imageContent}
            {bookContent}
            <DownloadBook id={id} className={styles.download} />
            {role === 'Administrator' && <DeleteBook className={styles.delete} id={id} />}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default Book;
import {useCallback, useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import useHttp from '../hooks/use-http';
import BookList from '../components/BookList';
import {useSelector} from 'react-redux';
import {Spinner, Card} from 'react-bootstrap';
import styles from './MainPage.module.css';
import NoBooksFound from '../components/NoBooksFound';
import Pagination from '../components/Pagination';

const MainPage = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const token = useSelector(state => state.auth.token);
  const pageNumber = parseInt(searchParams.get('p'));
  const search = searchParams.get('search');
  
  const booksForPageRequest = useCallback(async () => {
    let url = `/api/books?pageNumber=${pageNumber}`;
    if (search) {
      url = `/api/books?search=${search}&pageNumber=${pageNumber}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errorText || 'Failed to fetch books.');
    }
    
    return data.books;
  }, [pageNumber, search, token]);
  
  const {
    sendRequest,
    error,
    status,
    data
  } = useHttp(booksForPageRequest);
  
  const pageCountRequest = useCallback(async() => {
    let url = '/api/books/pageCount';
    if (search) {
      url += `?search=${search}`
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    return data.pageCount;
  }, [search, token]);
  
  const {
    sendRequest: getPageCount,
    data: pageCount
  } = useHttp(pageCountRequest);
  
  useEffect(() => {
    if (!pageNumber || pageNumber <= 0) {
      setSearchParams({
        p: 1
      });
      return;
    }
    
    sendRequest();
  }, [pageNumber, sendRequest, setSearchParams]);
  
  useEffect(() => {
    if (status === 'completed' && !error) {
      setBooks(data);
    }
  }, [status, error]);
  
  useEffect(() => {
    getPageCount();
  }, [getPageCount]);
  
  let content;
  
  if (status === 'pending') {
    content = (
      <Spinner
        className={styles['loading-spinner']}
        animation='border'
        role='search'
        size='lg'
      >
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    );
  }
  
  if (status === 'completed' && !error) {
    content = books.length === 0 ? <NoBooksFound /> : <BookList books={books} />;
  }
  
  if (status === 'completed' && error) {
    content = <NoBooksFound />;
  }
  
  return (
    <Card className={styles.container}>
      <Card.Body className={styles['container-body-content']}>{content}</Card.Body>
      {(!error && books.length !== 0) && (
        <Pagination
          pageCount={pageCount}
          active={pageNumber}
          params={searchParams}
          setSearchParams={setSearchParams}
        />
      )}
    </Card>
  )
};

export default MainPage;
import Book from './Book';
import styles from './BookList.module.css';

const BookList = (props) => {
  const books = props.books.map(book => {
    return (
      <Book
        key={book.id}
        title={book.title}
        id={book.id}
      />
    );
  });
  
  return (
    <ul
      style={{listStyleType: 'none'}}
      className={styles['book-list']}
    >
      {books}
    </ul>
  );
};

export default BookList;
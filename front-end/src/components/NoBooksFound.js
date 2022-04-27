import imgSrc from '../assets/books-not-found.png';
import {Image} from 'react-bootstrap';
import styles from './NoBooksFound.module.css';

const NoBooksFound = (props) => {
  return (
    <>
      <section className={styles.image}>
        <Image
          src={imgSrc}
          fluid
          alt='Not found image.'
          style={{width: '100%', height: '100%'}}
          draggable={false}
        />
      </section>
      <section className={styles.description}>
        <h2>Awww... Don't Cry.</h2>
        <p>There are no books yet on this page.</p>
        <p>We are sorry for not satisfying your reading desires.</p>
        <p>But we promise to update our library as soon as possible!</p>
      </section>
    </>
  );
};

export default NoBooksFound;
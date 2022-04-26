import useHttp from '../hooks/use-http';
import styles from './MainPage.module.css';

const MainPage = (props) => {
  useHttp()
  
  return (
    <div>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
      <p>hello</p>
    </div>
  );
};

export default MainPage;
import {Routes, Route, Navigate} from 'react-router-dom';
import Welcome from './pages/Welcome';
import {useSelector} from 'react-redux';
import MainPage from './pages/MainPage';
import Header from './components/Header';
import Profile from './pages/Profile';
import Book from './pages/Book';

const App = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  
  return (
    <>
      {isLoggedIn && <Header />}
      <Routes>
        {!isLoggedIn && (
          <>
            <Route path='/*' element={<Welcome />} />
          </>
        )}
        {isLoggedIn && (
          <>
            <Route path='/' element={<MainPage />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/book/:id' element={<Book />} />
            <Route path='/*' element={<Navigate to='/' />} />
          </>
        )}
      </Routes>
    </>
    
  );
};

export default App;
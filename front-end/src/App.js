import {Routes, Route, Navigate} from 'react-router-dom';
import Welcome from './pages/Welcome';
import {useSelector} from 'react-redux';
import MainPage from './pages/MainPage';
import Header from './components/Header';

const App = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  
  return (
    <>
      {isLoggedIn && <Header />}
      <Routes>
        {!isLoggedIn && <Route path='/*' element={<Welcome />} />}
        {isLoggedIn && (
          <>
            <Route path='/' element={<MainPage />} />
            {/*<Route path='/books/:id' element={<BookPage />} />*/}
            <Route path='/*' element={<Navigate to='/' />} />
          </>
        )}
        {/*<Route path='*' element={<NotFound />} />*/}
      </Routes>
    </>
    
  );
};

export default App;

// const App = () => {
//     const [imgUrl, setImgUrl] = useState();
//     const submitHandler = (e) => {
//         e.preventDefault();
//
//         const xhr = new XMLHttpRequest();
//
//         fetch('/api/books/1/content', {
//             method: 'GET',
//             headers: {
//                 Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbC1hZGRyZXNzIjoidGVzdEB0ZXN0Mi5jb20iLCJleHAiOjE2NTA0NjYzNzMsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTI0OS9hcGkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUyNDkvYXBpIn0.5MMOsFQtVojS9WplQdM1HbRKQ_EVtQl0RSuJ2MzinDc'
//             }
//         }).then(response => {
//             console.log(response);
//             return response.blob();
//         })
//             .then(blob => {
//                 console.log(blob);
//                 const url = URL.createObjectURL(blob);
//                 setImgUrl(url);
//                 const a = document.createElement('a');
//                 a.style = 'display: none';
//                 a.href = url;
//                 a.click();
//                 URL.revokeObjectURL(url);
//             });
//
//         //xhr.open('GET', '/api/avatar');
//         //xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbC1hZGRyZXNzIjoidGVzdEB0ZXN0Mi5jb20iLCJleHAiOjE2NTA0MzA2MDYsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTI0OS9hcGkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUyNDkvYXBpIn0.Pi4_BgDvUO6tPHW-6oIEUDRZDgVh1hzE_i0i7vxwdLo');
//
//         //xhr.send();
//         //xhr.onload = () => {
//         //    console.log(xhr.response);
//         //};
//
//         //console.log(e.target.avatar.files);
//
//         //const formData = new FormData(e.target);
//         //console.log(formData);
//         ///*fetch('/api/get').then(data => console.log(data));*/
//
//         //fetch('/api/file', {
//         //    method: 'POST',
//         //    body: formData
//         //}).then(data => console.log(data));
//     };
//
//     //fetch('/api/signup', { method: 'POST', body: null }).then(data => console.log(data));
//
//     return (
//         <>
//             <form onSubmit={submitHandler}>
//                 <input type='file' name='avatar' id='avatar' />
//                 <input type='submit' name='submit' id='submit' />
//             </form>
//             {!!imgUrl && <img src={imgUrl} />}
//         </>
//     );
// };
import {Link, NavLink, useNavigate} from 'react-router-dom';
import {Navbar, Container, Nav, Button, Form} from 'react-bootstrap';
import {useSelector, useDispatch} from 'react-redux';
import {authActions} from '../store/auth-slice';
import styles from './Header.module.css';

const Header = (props) => {
  const role = useSelector(state => state.auth.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const activeClassName = ({isActive}) => isActive
      ? `${styles.active} ${styles['nav-link']}`
      : styles['nav-link'];
  
  const logoutHandler = () => {
    dispatch(authActions.logout());
  };
  
  const searchSubmitHandler = (event) => {
    event.preventDefault();
    if (event.target['search'].value.length < 3) {
      return;
    }
    
    navigate(`/?search=${event.target['search'].value}&p=1`);
  }
  
  return (
    <Navbar bg='primary' sticky='top'>
      <Container className={styles['nav-container']}>
        <Navbar.Brand>
          <Link className={styles['home-link']} to='/'>E-Library</Link>
        </Navbar.Brand>
        <Nav className='me-auto' as='ul'>
          <Nav.Item as='li' className={styles['nav-item']}>
            <NavLink
              to='/'
              className={activeClassName}
            >
              Home
            </NavLink>
          </Nav.Item>
          {role === 'Administrator' && (
            <Nav.Item as='li' className={styles['nav-item']}>
              <NavLink
                to='upload'
                className={activeClassName}
              >
                Upload
              </NavLink>
            </Nav.Item>
          )}
        </Nav>
      </Container>
      <Form onSubmit={searchSubmitHandler} className={`d-flex ${styles['search-control']}`}>
        <Form.Control
          type='search'
          placeholder='Search'
          className='me-2'
          name='search'
        />
        <Button type='submit' variant='outline-info'>Search</Button>
      </Form>
      <Button variant='outline-info' className={styles['my-profile']}>
        <Link to='profile'>My Profile</Link>
      </Button>
      <Button onClick={logoutHandler} variant='danger'>Log Out</Button>
    </Navbar>
  );
};

export default Header;
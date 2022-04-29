import {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useHttp from '../hooks/use-http';
import styles from './Profile.module.css';
import {Card, Image, Placeholder, Toast} from 'react-bootstrap';
import ProfileInfo from '../components/ProfileInfo';

const Profile = (props) => {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const [random, setRandom] = useState();
  
  const avatarRequest = useCallback(async () => {
    const response = await fetch('/api/avatar', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const avatar = await response.blob();
    return URL.createObjectURL(avatar);
  }, [token]);
  
  const emailRequest = useCallback(async () => {
    const response = await fetch('/api/auth', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errorText || 'Failed to fetch your email.');
    }
    
    return data.email;
  }, [token]);
  
  const {
    sendRequest: getAvatar,
    status: avatarStatus,
    error: avatarError,
    data: avatarUrl
  } = useHttp(avatarRequest);
  
  const {
    sendRequest: getEmail,
    status: emailStatus,
    error: emailError,
    data: email
  } = useHttp(emailRequest);
  
  useEffect(() => {
    getAvatar();
    getEmail();
  }, [getAvatar, getEmail, random]);
  
  let imgContent;
  let infoContent;
  
  if (avatarStatus === 'pending') {
    imgContent = (
      <Placeholder
        bg='light'
        animation='glow'
        as='span'
        style={{width: '16rem', height: '24rem' }}
      />
    );
  }
  
  if (avatarStatus === 'completed' && !avatarError) {
    imgContent = (
      <Image
        src={avatarUrl}
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '24rem',
          maxHeight: '16rem',
          minWidth: '12rem',
          minHeight: '12rem'
        }}
        draggable={false}
        fluid
        rounded
        thumbnail
        alt='Avatar'
      />
    );
  }
  
  if (emailStatus === 'pending') {
    // Spinner
  }
  
  if (emailStatus === 'completed' && !emailError) {
    infoContent = (
      <p>Hello, <strong>{email}</strong></p>
    );
  }
  
  
  
  return (
    <Card className={styles.container}>
      <Card.Body className={styles['container-body']}>
        <Card className={styles['container-profile-info']}>
          <Card.Body>
            {imgContent}
            <div>
              {infoContent}
            </div>
          </Card.Body>
        </Card>
        <ProfileInfo onAvatarUpdate={() => setRandom(Math.random())} />
      </Card.Body>
    </Card>
  );
};

export default Profile;
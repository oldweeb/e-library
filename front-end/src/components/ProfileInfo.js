import {Card} from 'react-bootstrap';
import {useCallback, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useHttp from '../hooks/use-http';
import AvatarForm from './AvatarForm';
import UpdatePassword from './UpdatePassword';
import {authActions} from '../store/auth-slice';
import styles from './ProfileInfo.module.css';

const ProfileInfo = (props) => {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  
  const updateAvatar = useCallback(async (formData) => {
    const response = await fetch('/api/avatar', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to update avatar.');
    }
  }, [token]);
  
  const updatePassword = useCallback(async ({old, newPass}) => {
    const response = await fetch(`/api/auth/update`, {
      method: 'PUT',
      body: JSON.stringify({old, new: newPass}),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errorText || 'Failed to update password');
    }
    
    return data.token;
  }, [token]);
  
  const {
    sendRequest: sendAvatar,
    status: avatarStatus,
    error: avatarError
  } = useHttp(updateAvatar);
  
  const {
    sendRequest: sendUpdate,
    status: updateStatus,
    error: updateError,
    clearRequest: clearUpdate,
    data: newToken
  } = useHttp(updatePassword);
  
  useEffect(() => {
    if (avatarStatus === 'completed' && !avatarError) {
      props.onAvatarUpdate();
    }
  }, [avatarStatus, avatarError]);
  
  useEffect(() => {
    if (updateStatus === 'completed' && !updateError) {
      dispatch(authActions.updatePassword(newToken));
    }
   }, [updateStatus, updateError, newToken, dispatch]);
  
  const avatarSubmitHandler = (event) => {
    event.preventDefault();
    sendAvatar(new FormData(event.target));
  };
  
  const updatePasswordHandler = (event) => {
    event.preventDefault();
    sendUpdate({
      old: event.target.old.value,
      newPass: event.target.password.value
    });
  };
  
  return (
    <Card>
      <Card.Body className={styles['card-body']}>
        <AvatarForm
          submitHandler={avatarSubmitHandler}
          error={avatarError}
        />
        <UpdatePassword
          submitHandler={updatePasswordHandler}
          requestInfo={{
            sendRequest: sendUpdate,
            status: updateStatus,
            error: updateError,
            data: newToken,
            clearRequest: clearUpdate
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default ProfileInfo;
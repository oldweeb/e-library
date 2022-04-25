import {createSlice} from '@reduxjs/toolkit';

Date.prototype.addDays = function(days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const calculateRemainingTime = (expirationTime) => {
  if (expirationTime === null) {
    return 0;
  }
  
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  
  return adjExpirationTime - currentTime;
};

const getInitialState = () => {
  let storedToken = localStorage.getItem('token') || '';
  let storedExpirationTime = localStorage.getItem('expirationTime');
  
  const remainingTime = calculateRemainingTime(storedExpirationTime);
  
  if (remainingTime <= 60 * 1000) {
    storedToken = null;
    storedExpirationTime = null;
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
  }
  
  return {
    token: storedToken,
    expirationTime: storedExpirationTime,
    isLoggedIn: !!storedToken
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    login(state, action) {
      state.token = action.payload;
      const today = new Date();
      const expirationDate = today.addDays(1);
      state.expirationTime = expirationDate.toLocaleString();
      localStorage.setItem('token', action.payload);
      localStorage.setItem('expirationTime', expirationDate.toLocaleString());
    },
    logout(state) {
      state.token = '';
      state.expirationTime = null;
      localStorage.removeItem('token');
      localStorage.removeItem('expirationTime');
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice;
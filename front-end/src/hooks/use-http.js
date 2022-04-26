import {useReducer, useCallback} from 'react';

const httpReducer = (state, action) => {
  if (action.type === 'CLEAR') {
    return {
      data: null,
      error: null,
      status: null
    };
  }
  
  if (action.type === 'SEND') {
    return {
      data: null,
      error: null,
      status: 'pending',
    };
  }
  
  if (action.type === 'SUCCESS') {
    return {
      data: action.responseData,
      error: null,
      status: 'completed',
    };
  }
  
  if (action.type === 'ERROR') {
    return {
      data: null,
      error: action.errorMessage,
      status: 'completed',
    };
  }
  
  return state;
};

const useHttp = (requestFunction) => {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: null,
    data: null,
    error: null
  });
  
  const sendRequest = useCallback(async(requestData) => {
    dispatch({type: 'SEND'});
    try {
      const responseData = await requestFunction(requestData);
      dispatch({type: 'SUCCESS', responseData});
    } catch (error) {
      dispatch({
        type: 'ERROR',
        errorMessage: error.message || 'Something went wrong!'
      });
    }
  }, [requestFunction]);
  
  const clearRequest = useCallback(() => {
    dispatch({type: 'CLEAR'});
  }, []);
  
  return {
    sendRequest,
    clearRequest,
    ...httpState
  }
};

export default useHttp;
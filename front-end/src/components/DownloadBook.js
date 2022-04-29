import {Button, Modal} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import useHttp from '../hooks/use-http';

const DownloadBook = (props) => {
  const {id} = props;
  const token = useSelector(({auth}) => auth.token);
  const [download, setDownload] = useState(false);
  
  const getContentRequest = useCallback(async () => {
    const response = await fetch(`/api/books/${id}/content`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to download book.');
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }, [id, token]);
  
  const {
    sendRequest,
    status,
    error,
    clearRequest,
    data: contentUrl
  } = useHttp(getContentRequest);
  
  useEffect(() => {
    if (download && status === 'completed' && !error) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = contentUrl
      a.download = 'download.pdf';
      a.click();
      URL.revokeObjectURL(contentUrl);
      setDownload(false);
    }
  }, [download, status, error]);
  
  const downloadHandler = () => {
    setDownload(true);
    sendRequest();
  };
  
  return (
    <>
      <Modal show={!!error} onHide={() => clearRequest()}>
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Failed to download book. Try again later.</p>
        </Modal.Body>
      </Modal>
      <Button
        variant='outline-primary'
        className={props.className}
        onClick={downloadHandler}
        disabled={status === 'pending'}
      >
        Download
      </Button>
    </>
    
  );
};

export default DownloadBook;
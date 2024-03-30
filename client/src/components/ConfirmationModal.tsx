import * as React from 'react';
import { Box, Button, Card, Chip, Modal, Typography } from '@mui/material';
import useValidateTableData from '../hooks/useValidateTableData';
import { useEffect, useRef, useState } from 'react';

const ConfirmationModal = ({
  open,
  onClose,
  numSelected,
  tabType,
  selectedDynamicValues,
  reloadActiveTab
}: {
  open: boolean;
  onClose: () => void;
  numSelected: number;
  tabType:string;
  selectedDynamicValues: string[];
  reloadActiveTab: () => void;
}) => {

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    p: 4,
  };
  const [cardId, setCardId] = React.useState('question'); // State to trigger update
  const [triggerUpdate, setTriggerUpdate] = React.useState(false); // State to trigger update
  const [updateSingerError, setUpdateSingerError] = useState(null);
  const [updateSingerData, setUpdateSingerData] = useState(null);
  const prevUpdateSingerError = useRef();
  const prevUpdateSingerData = useRef();

  useEffect(() => {
    prevUpdateSingerError.current = updateSingerError;
    prevUpdateSingerData.current = updateSingerData;
  }, [updateSingerError, updateSingerData]);

  const handleApprove = () => {
    setTriggerUpdate(true); // Set trigger to true when approve button is clicked
  };


const handleClose = () => {
    onClose();
    // Reset error and data values when modal is closed
    setTriggerUpdate(false)
    setUpdateSingerError(null);
    setUpdateSingerData(null);
    setCardId('question')

  };
 
  const { loading, error, data } = useValidateTableData(triggerUpdate, selectedDynamicValues,tabType);

  useEffect(() => {
    if (!loading && !error && data) {
      setUpdateSingerData(data);
      reloadActiveTab();
      setCardId('answer')
    } else if (error) {
      setUpdateSingerError(error);
    }
  }, [loading, error, data]);


  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        {cardId === 'question' && (
          <Card id="question" style={{ padding: '30px', textAlign: 'left', width: '100%' }}>
           {(!updateSingerError?.message && (
            <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Approve {numSelected} selected records
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 3 }}>
              {selectedDynamicValues?.map((value, index) => (
                <Chip
                  key={index}
                  label={value}
                  style={{ color: '#1566a7', background: 'rgb(33 150 243 / 26%)', marginRight: '5px', marginBottom: '5px' }}
                />
              ))}
            </Typography>
            
            <div style={{ textAlign: 'right', padding: '40px 0px 0px' }}>
              <Button onClick={onClose} variant="outlined">
                Cancel
              </Button>{' '}
              &nbsp;
              <Button onClick={handleApprove} variant="contained">
                Approve
              </Button>
              </div> </div>
           ) )}
            {updateSingerError?.message &&(
                <div style={{textAlign:'center'}}>
                    <p>{updateSingerError?.message}</p>
                    <Button  variant='outlined' onClick={handleClose}>Close</Button>
                </div>
            )}
          </Card>
        )}
        {cardId === 'answer' && (
          <Card id="answer" style={{ padding: '30px', textAlign: 'center' }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            {updateSingerData && updateSingerData.message}
            </Typography>
            <div style={{ textAlign: 'center', padding: '40px 0px 0px' }}>
              <Button onClick={handleClose} variant="outlined">
                Okay
              </Button>{' '}
              &nbsp;
            </div>
          </Card>
        )}
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;

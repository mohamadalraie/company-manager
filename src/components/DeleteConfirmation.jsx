// src/components/DeleteConfirmationComponent.jsx

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Stack } from '@mui/material';
import axios from "axios";

// Helper Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DeleteConfirmationComponent({ itemId, deleteApi, onDeleteSuccess, onDeleteError }) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleClickOpen = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleDelete = async () => {
    setOpenConfirmDialog(false); // Close the confirmation dialog

    try {
      console.log(`Attempting to delete item with ID: ${itemId} from API: ${deleteApi}${itemId}`);
      const response = await axios.delete(`${deleteApi}${itemId}`);
      console.log("Delete successful:", response.data);

      // --- CRITICAL CHANGE HERE ---
      // Ensure snackbar state is set BEFORE calling onDeleteSuccess
      setSnackbarMessage(`Item ${itemId} deleted successfully!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true); // Open the Snackbar

      // Now call the parent's success handler
      if (onDeleteSuccess) {
        // onDeleteSuccess(itemId);
  
      }

    } catch (error) {
      console.error('Error during deletion:', error.response?.data || error.message);
      setSnackbarMessage(`Failed to delete item ${itemId}. Please try again.`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true); // Open the Snackbar with an error message

      if (onDeleteError) {
        onDeleteError(itemId, error);
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button
        color="error"
        onClick={handleClickOpen}
      >
        <DeleteOutlineIcon />
      </Button>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm deletion process"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item? Be careful, you cannot undo this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Stay open for 6 seconds
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default DeleteConfirmationComponent;
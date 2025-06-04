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
import { Stack,useTheme } from '@mui/material';
import axios from "axios";
import { tokens } from '../theme';

// Helper Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DeleteConfirmationComponent({ itemId, deleteApi, onDeleteSuccess, onDeleteError }) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
        // --- Apply custom styles to the Dialog ---
        PaperProps={{ // Target the Paper component that wraps the dialog content
          sx: {
            backgroundColor: colors.primary[700], // Example: A darker background
            color: colors.grey[100],             // Text color for the entire dialog
            borderRadius: '8px',                 // Rounded corners
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)', // Custom shadow
          }
        }}
        // --- End custom styles for Dialog ---
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            backgroundColor: colors.primary[800], // Header background
            color: colors.greenAccent[400],      // Header text color
            fontWeight: 'bold',
            padding: '16px 24px',
          
          }}
        >
          {"Confirm deletion process"}
        </DialogTitle>
        <DialogContent
          sx={{
            padding: '24px',
            color: colors.grey[200],
            backgroundColor:colors.primary[800] // Content text color
          }}
        >
          <DialogContentText id="alert-dialog-description" component="span"> {/* Use component="span" to apply color directly */}
            Are you sure you want to delete this item? Be careful, you cannot undo this action.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: colors.primary[800], // Footer background
            padding: '16px 24px',
          }}
        >
          <Button onClick={handleCloseConfirmDialog} sx={{ color: colors.grey[100] }}> {/* Custom color for Cancel */}
            Cancel
          </Button>
          <Button onClick={handleDelete} sx={{ color: colors.redAccent[500] }} autoFocus> {/* Custom color for Delete */}
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
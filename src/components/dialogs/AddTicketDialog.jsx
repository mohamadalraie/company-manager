import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, CircularProgress, Alert, IconButton, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../../theme'; // Adjust path if needed
import { baseUrl } from '../../shared/baseUrl'; // Adjust path if needed
import { createTicketApi } from '../../shared/APIs'; // Add this to your APIs file
import { getAuthToken } from '../../shared/Permissions'; // Adjust path if needed

/**
 * A reusable dialog component for creating a new ticket.
 * @param {object} props
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {function} props.onClose - Function to close the dialog.
 * @param {function} props.onSuccess - Callback function executed after a successful submission.
 * @param {string|number} props.relatedId - The ID of the related entity (e.g., project_id, user_id).
 */
const AddTicketDialog = ({ open, onClose, onSuccess, relatedId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Internal state for the form
  
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Function to reset the form and close the dialog
  const handleClose = () => {
   
    setDescription('');
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if ( !description.trim()) {
      setError('Ticket Text is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      description: description,
      assigned_to: relatedId, // Pass the related ID to the API
    };

    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
      await axios.post(`${baseUrl}${createTicketApi}`, payload, config);
      
      // Notify parent component of success
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose(); // Close the dialog
    } catch (err) {
      console.error("Failed to create ticket:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Create New Ticket
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            required
            margin="dense"
            id="description"
            label="Ticket Text"
            type="text"
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Submit Ticket"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTicketDialog;
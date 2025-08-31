import React, { useState } from 'react';
import { Paper, Box, Typography, Chip, Stack, Button, CircularProgress, useTheme, Snackbar, Alert } from '@mui/material';
import { tokens } from '../theme';
import { updateTicketApi } from '../shared/APIs';
import { baseUrl } from '../shared/baseUrl';
import { getAuthToken } from '../shared/Permissions';
import axios from 'axios';

const getStatusChipColor = (status) => {
  if (status === 'closed') return 'success';
  if (status === 'open') return 'info';
  return 'default';
};

const TicketCard = ({ ticket, showActions = false, onStatusChange }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    setLoading(true);
    try {
      // 1. Define the request configuration with the necessary headers
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': 'application/json'
        }
      };
  
      // The full URL for the API endpoint
      const url = `${baseUrl}/api/tickets/${ticket.id}/Closed`;
  
      // 2. Make the PUT request with the correct arguments
      // We pass 'null' as the 'data' (the second argument) because this request has no body.
      await axios.put(url, null, config);
  
      console.log(`Ticket ${ticket.id} status updated to Closed.`);
      
      // 3. Trigger the parent component to refetch data
      if (onStatusChange) {
        onStatusChange();
      }
  
    } catch (error) {
      // Provide more detailed error logging for easier debugging
      console.error("Failed to update ticket status:", error.response?.data || error.message);
      // You could also show an error message to the user here
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2.5,
        backgroundColor: colors.primary[800],
        borderRadius: '10px',
        borderLeft: `4px solid ${colors.greenAccent[500]}`,
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" color={colors.grey[200]}>
            Ticket #{ticket.id}
          </Typography>
          <Chip
            label={ticket.status.toUpperCase()}
            color={getStatusChipColor(ticket.status)}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </Stack>
        <Typography variant="body1" color={colors.grey[300]}>
          {ticket.description}
        </Typography>

        {showActions && (
          <Box display="flex" justifyContent="flex-end" gap={1.5} pt={1}>
            {loading ? <CircularProgress size={24} /> : (
              <>
              {/* {ticket.status==="open"&& */}
                <Button 
                  variant="contained" 
                  color="success" 
                  size="small" 
                  disabled={ticket.status === 'Closed'}
                  onClick={() => handleStatusUpdate()}
                >
                  Mark as Closed
                </Button>
{/* } */}
              </>
            )}
          </Box>
        )}
      </Stack>
      
    </Paper>
  );
};

export default TicketCard;
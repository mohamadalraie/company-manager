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


  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {

      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      await axios.patch(`${baseUrl}${updateTicketApi({tId:ticket.id})}`, config);
      console.log(`Updating ticket ${ticket.id} to status: ${newStatus}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onStatusChange) {
        onStatusChange(); // Trigger refetch in the parent
      }
    } catch (error) {
      console.error("Failed to update ticket status", error);
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
                <Button 
                  variant="contained" 
                  color="success" 
                  size="small" 
                  disabled={ticket.status === 'closed'}
                  onClick={() => handleStatusUpdate()}
                >
                  Mark as Closed
                </Button>

              </>
            )}
          </Box>
        )}
      </Stack>
      
    </Paper>
  );
};

export default TicketCard;
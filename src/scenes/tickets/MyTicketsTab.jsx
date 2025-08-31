import React from 'react';
import { Box, Stack, Typography, CircularProgress, Alert } from '@mui/material';
import useMyTicketsData from '../../hooks/getMyTickets'; // Adjust path
import TicketCard from '../../components/TicketCard'; // Adjust path

const MyTicketsTab = () => {
  const { tickets, loading, error } = useMyTicketsData();

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Failed to load tickets.</Alert>;

  return (
    <Box>
      {tickets.length > 0 ? (
        <Stack spacing={3}>
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </Stack>
      ) : (
        <Typography>You have not created any tickets.</Typography>
      )}
    </Box>
  );
};

export default MyTicketsTab;
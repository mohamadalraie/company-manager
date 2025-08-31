import React from 'react';
import { Box, Stack, Typography, CircularProgress, Alert } from '@mui/material';
// Assume you created a similar hook: useAssignedTicketsData
// import useAssignedTicketsData from '../../hooks/useAssignedTicketsData'; 
import TicketCard from '../../components/TicketCard'; // Adjust path
import useAssignedTicketsData from '../../hooks/getAssignedTickets';



const AssignedTicketsTab = () => {
  const { tickets, loading, error, refetch } = useAssignedTicketsData();

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Failed to load assigned tickets.</Alert>;

  return (
    <Box>
      {tickets.length > 0 ? (
        <Stack spacing={3}>
          {tickets.map(ticket => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              showActions={true} 
              onStatusChange={refetch} 
            />
          ))}
        </Stack>
      ) : (
        <Typography>No tickets are currently assigned to you.</Typography>
      )}
    </Box>
  );
};

export default AssignedTicketsTab;
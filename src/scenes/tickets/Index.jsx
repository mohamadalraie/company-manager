import React, { useState } from 'react';
import { Box, Tab, useTheme } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { tokens } from '../../theme';
import { Header } from '../../components/Header';
import MyTicketsTab from './MyTicketsTab';
import AssignedTicketsTab from './AssignedTicketsTab';

const TicketsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box m="20px">
      <Header title="TICKETS" subtitle="Manage your support tickets" />
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleTabChange}
            aria-label="Tickets tabs"
          >
            <Tab label="My Tickets" value="1" />
            <Tab label="Assigned Tickets" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1" sx={{ px: 0, pt: 3 }}>
          <MyTicketsTab />
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0, pt: 3 }}>
          <AssignedTicketsTab />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default TicketsPage;
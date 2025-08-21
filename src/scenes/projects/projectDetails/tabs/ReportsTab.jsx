// src/scenes/projects/path/to/tabs/ResourcesTab.jsx

import React, { useState } from "react";
import { Box, Tab, useTheme } from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { tokens } from "../../../../theme";

// --- استيراد المكونات الخارجية للتبويبات ---
import DocumentsTab from "./DocumentsTab"; // (تأكد من صحة المسار)
import MaterialsTab from "./MaterialsTab"; // (تأكد من صحة المسار)
import MaterialsReportsTab from "./MaterialsReportsTab";
import ProjectInventory from "./InventoryTab";
import FinancialTab from "./FinancialTab";


const ReportsTab = ({  }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for managing the active tab
  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box  sx={{ width: '100%' }}>
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList 
            onChange={handleTabChange} 
            aria-label="Project Resources Tabs"
            sx={{
              "& .MuiTab-root": { fontSize: '1rem', fontWeight: '600' },
              "& .Mui-selected": { color: colors.greenAccent[400] },
              "& .MuiTabs-indicator": { backgroundColor: colors.greenAccent[400] }
            }}
          >
            <Tab label="Inventory" value="1"/>
            <Tab label="Materials Reports" value="2" />
            <Tab label="Financials Reports" value="3" />
          </TabList>
        </Box>

        <TabPanel value="1" sx={{ p: 0, pt: 2 }}>
          <ProjectInventory />
        </TabPanel>

        <TabPanel value="2" sx={{ p: 0, pt: 2 }}>
          <MaterialsReportsTab />
        </TabPanel>

        <TabPanel value="3" sx={{ p: 0, pt: 2 }}>
          <FinancialTab />
        </TabPanel>

      </TabContext>
    </Box>
  );
};

export default ReportsTab;
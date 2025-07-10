// src/scenes/projects/path/to/tabs/ResourcesTab.jsx

import React, { useState } from "react";
import { Box, Tab, useTheme } from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';

import { tokens } from "../../../../theme";

// --- استيراد المكونات الخارجية للتبويبات ---
import DocumentsTab from "./DocumentsTab"; // (تأكد من صحة المسار)
import MaterialsTab from "./MaterialsTab"; // (تأكد من صحة المسار)


const ResourcesTab = ({ projectId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for managing the active tab
  const [activeTab, setActiveTab] = useState('1');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box m="20px" sx={{ width: '100%' }}>
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
            <Tab label="Project Files" value="1" />
            <Tab label="Project Materials" value="2" />
          </TabList>
        </Box>

        {/* --- TAB 1: DOCUMENTS / FILES --- */}
        <TabPanel value="1" sx={{ p: 0, pt: 2 }}>
          <DocumentsTab projectId={projectId} />
        </TabPanel>

        {/* --- TAB 2: MATERIALS / INVENTORY --- */}
        <TabPanel value="2" sx={{ p: 0, pt: 2 }}>
          <MaterialsTab projectId={projectId} />
        </TabPanel>
        
      </TabContext>
    </Box>
  );
};

export default ResourcesTab;
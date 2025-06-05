import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider,Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useState } from "react"; // Import useState here

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar"; // Assuming this is your ProSidebar
import Dashboard from "./scenes/dashboard/index";
import Engineers from "./scenes/engineers/Index";
import Projects from "./scenes/projects/Index";
import SalesManagers from "./scenes/salesManagers/index";
import AddEngineer from "./scenes/engineers/addEngineer/index";
import ConsultingEngineers from "./scenes/consultingEngineers/Index";
import ConsultingCompanies from "./scenes/consultingCompanies";
import AddConsultingCompany from "./scenes/consultingCompanies/addConsultingCompany";
import Owners from "./scenes/owners";
import AddOwner from "./scenes/owners/addOwner";

function App() {
  const [theme, colorMode] = useMode();
  // Move the isCollapsed state to App.js
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Define sidebar widths (adjust these values if needed)
  const collapsedSidebarWidth = "80px";
  const expandedSidebarWidth = "270px"; // This is the default expanded width for react-pro-sidebar

  // Calculate dynamic margin for main content
  const mainContentMargin = isSidebarCollapsed ? collapsedSidebarWidth : expandedSidebarWidth;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className="app"
          style={{
            display: "flex", // Makes sidebar and main content sit side-by-side
            minHeight: "100vh", // Ensures the app takes at least full viewport height
            width: "100%", // Ensures the app takes full viewport width
            position: "relative", // Important if you have absolutely positioned elements inside
          }}
        >
          {/* Pass the isCollapsed state and its setter to the Sidebar */}
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />

          <main
            className="content"
            style={{
              flexGrow: 1, // Allows main content to take up remaining horizontal space
              overflowY: "auto", // Makes only the main content area scrollable vertically
              maxHeight: "100vh", // Ensures main content doesn't exceed viewport height
              marginLeft: mainContentMargin, // Dynamic margin based on sidebar state
              transition: "margin-left 0.3s ease-in-out", // Smooth transition for margin
              display: "flex", // Use flex to stack Topbar and Routes content
              flexDirection: "column",
            }}
          >
            <Topbar /> {/* Topbar should be inside main content */}
            <Box flexGrow={1} overflow="auto"> {/* Allows route content to scroll independently if it overflows */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/engineers" element={<Engineers />} />
                <Route path="/engineers/add" element={<AddEngineer />} />
                <Route path="/ConsultingCompanies" element={<ConsultingCompanies/>} />
                <Route path="/ConsultingCompanies/add" element={<AddConsultingCompany/>} />
                <Route path="/ConsultingEngineers" element={<ConsultingEngineers />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/salesManagers" element={<SalesManagers />} />
                <Route path="/owners" element={<Owners />} />
                <Route path="/owners/add" element={<AddOwner />} />
                <Route path="*" element={<div>404</div>} />
              </Routes>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
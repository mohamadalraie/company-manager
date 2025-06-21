import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/index";
import Engineers from "./scenes/engineers/Index";
import Projects from "./scenes/projects/Index";
import SalesManagers from "./scenes/salesManagers/index";
import AddEngineer from "./scenes/engineers/addEngineer/index";
import ConsultingEngineers from "./scenes/consultingCompanies/consultingEngineers/Index";
import ConsultingCompanies from "./scenes/consultingCompanies";
import AddConsultingCompany from "./scenes/consultingCompanies/addConsultingCompany";
import Owners from "./scenes/owners";
import AddOwner from "./scenes/owners/addOwner";
import AddProject from "./scenes/projects/addProject";
import ProjectDetails from "./scenes/projects/projectDetails";
import Login from "./scenes/auth/Login";
import AddConsultingEngineer from "./scenes/consultingCompanies/consultingEngineers/addConsultingEngineer";
import AddParticipant from "./scenes/projects/projectDetails/AddParticipant";
import ProjectManagers from "./scenes/projectManagers/Index";
import AddProjectManager from "./scenes/projectManagers/addProjectManger";
import AddFile from "./scenes/projects/projectDetails/AddFile";
import AddProjectFile from "./scenes/projects/projectDetails/AddFile";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation(); // Get the current location



  // Routes with no sidebar and topbar
  const noLayoutRoutes = ['/login'];
  const showLayout = !noLayoutRoutes.includes(location.pathname);

  // Define sidebar widths
  const collapsedSidebarWidth = "80px";
  const expandedSidebarWidth = "270px";

  // Calculate dynamic margin for main content. It should be 0 if the sidebar is not shown.
  const mainContentMargin = showLayout
    ? isSidebarCollapsed
      ? collapsedSidebarWidth
      : expandedSidebarWidth
    : "0px";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className="app"
          style={{
            display: "flex",
            minHeight: "100vh",
            width: "100%",
            position: "relative",
          }}
        >
          {/* Conditionally render the Sidebar based on the route */}
          {showLayout && (
            <Sidebar
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
            />
          )}

          <main
            className="content"
            style={{
              flexGrow: 1,
              overflowY: "auto",
              maxHeight: "100vh",
              marginLeft: mainContentMargin, // Dynamic margin based on sidebar state and visibility
              transition: "margin-left 0.3s ease-in-out",
              display: "flex",
              flexDirection: "column",
              width: "100%", // Ensure main content takes full width
            }}
          >
            {/* Conditionally render the Topbar */}
            {showLayout && <Topbar />}

            {/* This Box will contain the routed components */}
            <Box flexGrow={1} overflow="auto">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/engineers" element={<Engineers />} />
                <Route path="/engineers/add" element={<AddEngineer />} />
                <Route path="/ConsultingCompanies" element={<ConsultingCompanies />} />
                <Route path="/ConsultingCompanies/add" element={<AddConsultingCompany />} />
                <Route path="/ConsultingCompanies/:id/ConsultingEngineers" element={<ConsultingEngineers />} />
                <Route path="/ConsultingCompanies/:id/ConsultingEngineers/add" element={<AddConsultingEngineer />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/add" element={<AddProject />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/projects/:id/files/add" element={<AddProjectFile />} />
                <Route path="/salesManagers" element={<SalesManagers />} />
                <Route path="/owners" element={<Owners />} />
                <Route path="/owners/add" element={<AddOwner />} />
                <Route path="/projectManagers" element={<ProjectManagers />} />
                <Route path="/projectManagers/add" element={<AddProjectManager />} />
                
                {/* A catch-all route for 404 Not Found pages */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Routes>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

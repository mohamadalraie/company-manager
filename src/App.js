import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {Routes,Route} from "react-router-dom"; 
import { useState } from "react";
import Topbar from "./scenes/global/Topbar";
import  Sidebar  from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/index";
import Engineers from "./scenes/engineers/Index";
import Projects from "./scenes/projects/Index";
// import Statistics from "./scenes/Statistics";
// import Dashboard from "./scenes/dashboard";
// import Dashboard from "./scenes/dashboard";
// import Dashboard from "./scenes/dashboard";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar  setIsSidebar={setIsSidebar}/>
            <Routes>
              <Route path="/" element={<Dashboard/>}/>
              <Route  path="/engineers" element={<Engineers />}/>
              <Route path="/projects" element={<Projects/>}/>
              <Route path="*" element={<div>404</div>}/>
            </Routes>
            </main> 
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

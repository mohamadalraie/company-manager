import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {Routes,Route} from "react-router-dom"; 
import Topbar from "./scenes/global/Topbar";
import  Sidebar  from "./scenes/global/Sidebar";
import Dashboard from "./scenes/Dashboard";
import Engineers from "./scenes/Engineers";
import Projects from "./scenes/Projects";
// import Statistics from "./scenes/Statistics";
// import Dashboard from "./scenes/dashboard";
// import Dashboard from "./scenes/dashboard";
// import Dashboard from "./scenes/dashboard";


function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar/>
          <main className="content">
            <Topbar/>
            <Routes>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/engineers" element={<Engineers/>}/>
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

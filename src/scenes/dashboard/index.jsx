
import {
  getAuthToken,
  getPermissions,
  getRole,
} from "../../shared/Permissions";
// import { Chrono } from "react-chrono";

// export default function Dashboard() {

//   return (
//     <Box m="10px">
//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Header
//           title={"Dashboard"}
//           subtitle={`${getAuthToken()}`}
//         />
//       </Box>
//       <Typography variant="h6">{getRole()}</Typography>
//       <Typography variant="h6">{getPermissions()}</Typography>
//     </Box>
//   );
// }
// src/scenes/dashboard/index.jsx (Example)
// src/scenes/dashboard/index.jsx (Updated)
import React from 'react';
import { Box, Grid, useTheme ,Typography} from '@mui/material';
import {orange,red}from '@mui/material/colors';
import { Header } from '../../components/Header';
import StatCard from '../../components/StatCard';
import ProjectsStatusPie from '../../components/ProjectsStatusPie';
import BudgetPerformanceChart from '../../components/BudgetPerformanceChart'; // <-- استيراد جديد
import UpcomingDeadlines from '../../components/UpcomingDeadlines'; // <-- استيراد جديد

// Icons
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { tokens } from '../../theme';

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Placeholder data
    const totalProjects = 25;
    const activeEngineers = 42;
    const consultingCompanies = 12;
    const completedProjects = 8;

    return (
        <Box m="20px">
            <Header title="Dashboard" subtitle="Welcome to your project management dashboard" />
            
    <Box m="10px">
       <Box display="flex" justifyContent="space-between" alignItems="center">
         <Header
          title={"Dashboard"}
          subtitle={`${getAuthToken()}`}
        />
      </Box>
      <Typography variant="h6">{getRole()}</Typography>
      <Typography variant="h6">{getPermissions()}</Typography>
    </Box>
            <Grid container spacing={3}>
                {/* KPI Cards Row */}
                <Grid item xs={12} sm={6} md={3}><StatCard title="Total Projects" value={totalProjects} icon={<AccountTreeIcon sx={{ fontSize: '2rem' }} />} color={colors.blueAccent[500]} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Active Engineers" value={activeEngineers} icon={<EngineeringIcon sx={{ fontSize: '2rem' }} />} color={orange} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Consulting Companies" value={consultingCompanies} icon={<BusinessCenterIcon sx={{ fontSize: '2rem' }} />} color={red} /></Grid>
                <Grid item xs={12} sm={6} md={3}><StatCard title="Completed Projects" value={completedProjects} icon={<PeopleIcon sx={{ fontSize: '2rem' }} />} color={colors.greenAccent[500]} /></Grid>

                {/* Second Row with Charts */}
                <Grid item xs={12} lg={8}>
                    <BudgetPerformanceChart /> {/* <-- المكون الجديد هنا */}
                </Grid>
                <Grid item xs={12} lg={4}>
                    <ProjectsStatusPie />
                </Grid>

                 {/* Third Row with Lists/Feeds */}
                 <Grid item xs={12} lg={12}>
                    <UpcomingDeadlines /> {/* <-- المكون الجديد هنا */}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
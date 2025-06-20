import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Fade,
} from "@mui/material";
import { tokens } from "../../../theme";

// --- Icons ---
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import LayersIcon from "@mui/icons-material/LayersOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AspectRatioIcon from "@mui/icons-material/AspectRatioOutlined";
import PersonIcon from "@mui/icons-material/PersonOutline";
import  PeopleOutlineOutlined  from "@mui/icons-material/PeopleOutlineOutlined";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import CodeIcon from "@mui/icons-material/CodeOutlined";
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOnOutlined';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';

import useOneProjectData from "../../../hooks/getOneProjectDataHook";
import GeneralInfoTab from "./tabs/GeneralInfoTab";
import ConsultingCompanyTab from "./tabs/ConsultingCompanyTab";
import TeamTab from "./tabs/TeamTab"
import DocumentTab from "./tabs/DocumentsTab";


  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`project-tabpanel-${index}`}
        aria-labelledby={`project-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Fade in={true} timeout={500}>
              <div>{children}</div>
            </Fade>
          </Box>
        )}
      </div>
    );
  }
  
  function a11yProps(index) {
    return {
      id: `project-tab-${index}`,
      "aria-controls": `project-tabpanel-${index}`,
    };
  }

// --- Main Component ---
const ProjectDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();
  const { project, isLoading, error } = useOneProjectData(id);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="80vh"><CircularProgress /></Box>;
  }
  if (error) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="80vh"><Alert severity="error">{error}</Alert></Box>;
  }
  if (!project) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="80vh"><Alert severity="info">No project data available.</Alert></Box>;
  }

  return (
    <Fade in={!isLoading} timeout={800}>
      <Box m="10px">
        {/* <Box mb={4}>
          <Typography variant="h3" color={colors.grey[100]} fontWeight="bold">
            Project Overview
          </Typography>
        </Box> */}

        <Box
          sx={{
            backgroundColor: colors.primary[800],
     
            borderRadius: "18px",
            // boxShadow: `0px 10px 30px -5px ${colors.grey[900]}`,
            // border: `1px solid ${colors.grey[700]}`,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: colors.grey[700], backgroundColor: colors.primary[800], borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }}>
            <Tabs
            
              value={value}
              onChange={handleChange}
              aria-label="project details tabs"
              TabIndicatorProps={{ sx: { backgroundColor: colors.greenAccent[500], height: 3 } }}
              textColor="inherit"
              variant="fullWidth"
              // backgroundColor={colors.primary[100]}
              sx={{
                // يمكنك تغيير هذه القيمة حسب الارتفاع الذي تريده
                // الارتفاع الافتراضي هو 48px
                minHeight: '48px', 
                
                // هذا السطر يستهدف كل تبويب (Tab) داخل حاوية الـ Tabs
                '& .MuiTab-root': {
                    minHeight: '48px', // تأكد من تطابق هذه القيمة مع القيمة أعلاه
               // يمكنك تعديل حجم الخط ليتناسب مع الارتفاع الجديد
                }
            }}
            >
              <Tab icon={<DescriptionIcon />} iconPosition="start" label="General Information" {...a11yProps(0)} sx={{ color: colors.grey[300], '&.Mui-selected': { color: colors.greenAccent[300], fontWeight:'bold' } }} />
              <Tab icon={<BusinessIcon />} iconPosition="start" label="Consulting Company" {...a11yProps(1)} sx={{ color: colors.grey[300], '&.Mui-selected': { color: colors.greenAccent[300], fontWeight:'bold' } }} />
              <Tab icon={<PeopleOutlineOutlined />} iconPosition="start" label="Team" {...a11yProps(2)} sx={{ color: colors.grey[300], '&.Mui-selected': { color: colors.greenAccent[300], fontWeight:'bold' } }} />
              <Tab icon={<MonetizationOnIcon />} iconPosition="start" label="Financials" {...a11yProps(3)} sx={{ color: colors.grey[300], '&.Mui-selected': { color: colors.greenAccent[300], fontWeight:'bold' } }} />
              <Tab icon={<ArticleIcon />} iconPosition="start" label="Documents" {...a11yProps(4)} sx={{ color: colors.grey[300], '&.Mui-selected': { color: colors.greenAccent[300], fontWeight:'bold' } }} />
            </Tabs>
          </Box>


              {/* Tabs */}

          <TabPanel value={value} index={0}>
              <GeneralInfoTab
                project={project}
              />
          </TabPanel>

          <TabPanel value={value} index={1}>
           <ConsultingCompanyTab
           consultingCompany={project.consultingCompany}
           />
          </TabPanel>

          <TabPanel value={value} index={2}>
          <TeamTab
           participants={project.participants}
           projectId={project.id}
           />
            </TabPanel>

          <TabPanel value={value} index={3}>
            <Typography variant="h5" color={colors.grey[300]}>Documents</Typography>
            <Typography color={colors.grey[400]}>A list of project-related documents (e.g., contracts, blueprints) will be available here.</Typography>
          </TabPanel>
          <TabPanel value={value} index={4}>
         <DocumentTab/>
         </TabPanel>
        </Box>
      </Box>
    </Fade>
  );
};

export default ProjectDetails;
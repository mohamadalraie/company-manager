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
import PeopleOutlineOutlined from "@mui/icons-material/PeopleOutlineOutlined";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import SplitscreenIcon from "@mui/icons-material/SplitscreenOutlined";
import DescriptionIcon from "@mui/icons-material/DescriptionOutlined";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOnOutlined";
import ArticleIcon from "@mui/icons-material/ArticleOutlined";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';



import useOneProjectData from "../../../hooks/getOneProjectDataHook";
import GeneralInfoTab from "./tabs/GeneralInfoTab";
import ConsultingCompanyTab from "./tabs/ConsultingCompanyTab";
import TeamTab from "./tabs/TeamTab";
import DocumentTab from "./tabs/DocumentsTab";
import { havePermission } from "../../../shared/Permissions";
import ProjectStagesComponent from "./tabs/ProjectTimeLine";
import ProjectCalendarView from "./tabs/CalendarTab";
import ProjectGridCalendar from "./tabs/CalendarTab";
import ProjectInventory from "./tabs/InventoryTab";
import ResourcesTab from "./tabs/ResourcesTab";

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
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  if (!project) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <Alert severity="info">No project data available.</Alert>
      </Box>
    );
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
          <Box
            sx={{
              borderBottom: 1,
              borderColor: colors.grey[700],
              backgroundColor: colors.primary[800],
              borderTopLeftRadius: "18px",
              borderTopRightRadius: "18px",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="project details tabs"
              TabIndicatorProps={{
                sx: { backgroundColor: colors.greenAccent[500], height: 2 },
              }}
              textColor="inherit"
              variant="fullWidth"
              // backgroundColor={colors.primary[100]}
              sx={{
                minHeight: "40px",

                // هذا السطر يستهدف كل تبويب (Tab) داخل حاوية الـ Tabs
                "& .MuiTab-root": {
                  minHeight: "40px", // تأكد من تطابق هذه القيمة مع القيمة أعلاه
                  // يمكنك تعديل حجم الخط ليتناسب مع الارتفاع الجديد
                },
              }}
            >
              <Tab
                icon={<DescriptionIcon />}
                iconPosition="start"
                label="General Information"
                {...a11yProps(0)}
                sx={{
                  color: colors.grey[300],
                  "&.Mui-selected": {
                    color: colors.greenAccent[300],
                    fontWeight: "bold",
                  },
                }}
              />

              <Tab
                icon={<BusinessIcon />}
                iconPosition="start"
                label="Consulting Company"
                {...a11yProps(1)}
                sx={{
                  color: colors.grey[300],
                  "&.Mui-selected": {
                    color: colors.greenAccent[300],
                    fontWeight: "bold",
                  },
                }}
              />

              <Tab
                icon={<PeopleOutlineOutlined />}
                iconPosition="start"
                label="Team"
                {...a11yProps(2)}
                sx={{
                  color: colors.grey[300],
                  "&.Mui-selected": {
                    color: colors.greenAccent[300],
                    fontWeight: "bold",
                  },
                }}
              />

              <Tab
                icon={<MonetizationOnIcon />}
                iconPosition="start"
                label="Financials"
                {...a11yProps(3)}
                sx={{
                  color: colors.grey[300],
                  "&.Mui-selected": {
                    color: colors.greenAccent[300],
                    fontWeight: "bold",
                  },
                }}
              />
              <Tab
                icon={<ArticleIcon />}
                iconPosition="start"
                label="Studies"
                {...a11yProps(4)}
                sx={{
                  color: colors.grey[300],
                  "&.Mui-selected": {
                    color: colors.greenAccent[300],
                    fontWeight: "bold",
                  },
                }}
              />
              <Tab
                icon={<SplitscreenIcon />}
                iconPosition="start"
                label="Stages"
                {...a11yProps(5)}
                sx={{
                  color: colors.grey[300],
                  "&.Mui-selected": {
                    color: colors.greenAccent[300],
                    fontWeight: "bold",
                  },
                }}
              />
              <Tab
                icon={<CalendarMonthIcon />}
                iconPosition="start"
                label="Calendar"
                {...a11yProps(6)}
                sx={{
                  color: colors.grey[300],
                  "&.Mui-selected": {
                    color: colors.greenAccent[300],
                    fontWeight: "bold",
                  },
                }}
              />

              <Tab
                icon={<Inventory2Icon />}
                iconPosition="start"
                label="Inventory"
                {...a11yProps(7)}
                sx={{
                  color: colors.grey[300],
                  "&.Mui-selected": {
                    color: colors.greenAccent[300],
                    fontWeight: "bold",
                  },
                }}
              />
            </Tabs>
          </Box>

          {/* Tabs */}

          <TabPanel value={value} index={0}>
            {havePermission("details projects") && (
              <GeneralInfoTab project={project} />
            )}
          </TabPanel>

          <TabPanel value={value} index={1}>
            {havePermission("view project department studies") && (
              <ConsultingCompanyTab
                consultingCompany={project.consultingCompany}
              />
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {havePermission("view project department execution") && (
              <TeamTab
                participants={project.participants}
                projectId={project.id}
              />
            )}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {havePermission("csad") && (
              <Box>
                <Typography variant="h5" color={colors.grey[300]}>
                  Documents
                </Typography>
                <Typography color={colors.grey[400]}>
                  A list of project-related documents (e.g., contracts,
                  blueprints) will be available here.
                </Typography>
              </Box>
            )}
          </TabPanel>

          <TabPanel value={value} index={4}>
            {havePermission("view reports resource management") && (
              <ResourcesTab projectId={id} />
            )}
          </TabPanel>
          <TabPanel value={value} index={5}>
            {havePermission("view reports resource management") && (
              <ProjectStagesComponent
                projectId={id}
                consultingCompanyId={project.consultingCompany.id}
                participants={project.participants}
              />
            )}
          </TabPanel>

          <TabPanel value={value} index={6}>
            {havePermission("view reports resource management") && (
              <ProjectGridCalendar projectId={id} />
            )}
          </TabPanel>
          
          <TabPanel value={value} index={7}>
            {havePermission("view reports resource management") && (
              <ProjectInventory projectId={id} />
            )}
          </TabPanel>
        </Box>
      </Box>
    </Fade>
  );
};

export default ProjectDetails;

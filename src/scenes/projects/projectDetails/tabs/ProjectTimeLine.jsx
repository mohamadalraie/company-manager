import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Tooltip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider,
} from "@mui/material";
import StepConnector from "@mui/material/StepConnector";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Icons
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { tokens } from "../../../../theme";
import TasksKanbanView from "../../../../components/Task";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'; // Icon for collapsing
import ChevronRightIcon from '@mui/icons-material/ChevronRight'; // Icon for expanding
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // 👈 Add this to your imports
import AddNewStage from "../../../../components/AddStage";



// --- Helper function to format dates ---
const formatDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const options = { month: "short", day: "numeric" };
  const startStr = startDate.toLocaleDateString("en-US", options);
  const endStr = endDate.toLocaleDateString("en-US", {
    ...options,
    year: "numeric",
  });

  return `${startStr} -> ${endStr}`;
};

// --- Initial Data (can be passed as a prop) ---
const initialStagesData = [
  {
    id: "stage_1",
    number: 1,
    title: "Analyzing Stage",
    description: "gathering the requierments and analyse it.",
    startDate: "2025-05-01",
    endDate: "2025-05-20",
    tasks: [
      { id: "task_1a", text: "عقد اجتماع مع العميل", status: "not_started" },
      { id: "task_1b", text: "كتابة وثيقة المتطلبات", status: "done" },
      { id: "task_1c", text: "إعداد خطة العمل الأولية", status: "done" },
    ],
  },
  {
    id: "stage_2",
    number: 2,
    title: "Design Stage",
    description: "Design the UI of the Application.",
    startDate: "2025-05-21",
    endDate: "2025-07-15",
    tasks: [
      { id: "task_2a", text: "تصميم النماذج الأولية", status: "done" },
      {
        id: "task_2b",
        text: "تصميم واجهة المستخدم النهائية",
        status: "waiting",
      },
      {
        id: "task_2c",
        text: "تصميم بنية قاعدة البيانات",
        status: "in_progress",
      },
      {
        id: "task_2d",
        text: "مراجعة التصميم مع الفريق",
        status: "not_started",
      },
    ],
  },
  {
    id: "stage_3",
    number: 3,
    title: "Implementation and Coding Stage",
    description: "Write the Programming Code Of the Application.",
    startDate: "2025-07-16",
    endDate: "2025-08-30",
    tasks: [],
  },
];

const ProjectStagesComponent = ({ projectId ,initialStages = initialStagesData }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false); 
  const [expanded, setExpanded] = useState(initialStages[0]?.id || false);
  const [tasks, setTasks] = useState(() =>
    initialStages.flatMap((stage) => stage.tasks)
  );

  const statusConfig = {
    done: {
      icon: <CheckCircleOutlineIcon />,
      color: colors.greenAccent[400],
      label: "Done",
    },
    in_progress: {
      icon: <AutorenewIcon />,
      color: theme.palette.warning.main,
      label: "In Progress",
    },
    waiting: {
      icon: <HourglassEmptyIcon />,
      color: colors.blueAccent[500],
      label: "Waiting",
    },
    not_started: {
      icon: <RadioButtonUncheckedIcon />,
      color: colors.grey[500],
      label: "Not Started",
    },
  };

  const projectStages = useMemo(() => {
    const today = new Date();
    // To ensure the "Current" stage is reflected correctly in this example, let's set "today" to a date within stage 2
    const exampleToday = new Date("2025-06-28");

    return initialStages.map((stage) => {
      const stageTasks = stage.tasks
        .map((st) => tasks.find((t) => t.id === st.id))
        .filter(Boolean);
      const totalTasksCount = stage.tasks.length;
      const counts = {
        done: stageTasks.filter((t) => t.status === "done").length,
        in_progress: stageTasks.filter((t) => t.status === "in_progress")
          .length,
        waiting: stageTasks.filter((t) => t.status === "waiting").length,
      };

      let stageStatus = "notStarted";
      if (counts.done === totalTasksCount && totalTasksCount > 0) {
        stageStatus = "completed";
      } else if (
        counts.done > 0 ||
        counts.in_progress > 0 ||
        counts.waiting > 0
      ) {
        stageStatus = "inProgress";
      }

      const isCurrent =
        exampleToday >= new Date(stage.startDate) &&
        exampleToday <= new Date(stage.endDate);

      return {
        ...stage,
        tasks: stageTasks,
        totalTasksCount,
        counts,
        stageStatus,
        isCurrent,
        formattedDateRange: formatDateRange(stage.startDate, stage.endDate),
        percentages: {
          done: totalTasksCount > 0 ? (counts.done / totalTasksCount) * 100 : 0,
          in_progress:
            totalTasksCount > 0
              ? (counts.in_progress / totalTasksCount) * 100
              : 0,
          waiting:
            totalTasksCount > 0 ? (counts.waiting / totalTasksCount) * 100 : 0,
        },
      };
    });
  }, [initialStages, tasks]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleToggleTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "done" ? "not_started" : "done" }
          : task
      )
    );
  };

  const activeStepIndex = expanded
    ? projectStages.findIndex((stage) => stage.id === expanded)
    : -1;





    // Main Return
  return (
    
    <Box display="flex" gap={1}>
        {/* Accordion */}
        <Box>
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        {projectStages.map((stage) => (
          <Accordion
            key={stage.id}
            expanded={expanded === stage.id}
            onChange={handleAccordionChange(stage.id)}
            disableGutters
            elevation={0}
            sx={{
              backgroundColor: "transparent",
              borderBottom: `1px solid ${colors.grey[700]}`,
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: colors.greenAccent[400] }} />
              }
              sx={{
                borderRadius: 1,
                backgroundColor:
                  expanded === stage.id ? colors.primary[800] : "transparent",
                "&:hover": {
                  backgroundColor: colors.primary[900], // Or any color from your theme
                },
              }}
            >
              <Box display="flex" alignItems="center" width="100%" gap={1}>
                <Box flexGrow={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color={colors.grey[100]}
                    >
                      {stage.title}
                    </Typography>
                    {stage.isCurrent && (
                      <Chip
                        label="Current Stage"
                        size="small"
                        color="success"
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color={colors.grey[400]}>
                    {stage.description}
                  </Typography>
                </Box>

                {/* percentage silder */}
                {stage.totalTasksCount > 0 && (
                  <Box display="flex" alignItems="center" gap={2} mr="20px">
                    <Typography
                      variant="body2"
                      color={colors.grey[300]}
                      fontWeight="bold"
                    >{`${Math.round(stage.percentages.done)}%`}</Typography>
                    <Tooltip
                      title={`Done: ${stage.counts.done} | In Progress: ${stage.counts.in_progress} | Waiting: ${stage.counts.waiting}`}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          width: "120px",
                          height: "8px",
                          borderRadius: "4px",
                          overflow: "hidden",
                          backgroundColor: colors.grey[600],
                        }}
                      >
                        <Box
                          sx={{
                            width: `${stage.percentages.done}%`,
                            backgroundColor: statusConfig.done.color,
                          }}
                        />
                        <Box
                          sx={{
                            width: `${stage.percentages.in_progress}%`,
                            backgroundColor: statusConfig.in_progress.color,
                          }}
                        />
                        <Box
                          sx={{
                            width: `${stage.percentages.waiting}%`,
                            backgroundColor: statusConfig.waiting.color,
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{ p: 2, backgroundColor: colors.primary[900] }}
            >
           
              {stage.tasks.length > 0 ? <TasksKanbanView/>
              : (
                <Typography
                  sx={{ textAlign: "center", color: colors.grey[400], p: 2 }}
                >
                  There is no Tasks in this Stage
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      <AddNewStage projectId={projectId}/> {/* <-- Place the new component here */}
    </Box>
 

      {/* Side Time Line  */}
      <Box
    display="column"
    alignItems={"start"}
    // The width will now be dynamic
    minwidth={isTimelineCollapsed ? "5%" : "25%"} // 👈 Change this
    width={isTimelineCollapsed ? "5%" : "25%"} // 👈 Change this
    sx={{
        // position: 'relative', // Needed for positioning the button
        transition: 'width 0.3s ease-in-out', // Animate the width change
        // overflow: 'hidden', 
        overflowWrap: 'break-all',
    }}
>
    {/* --- Toggle Button --- */}
    <Box 
        display="flex" 
        justifyContent="flex-start" // Pushes the button to the end (left in RTL)
        width="100%" 
        sx={{ ml:"10px" }}
    >
    <IconButton
        onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
        sx={{
            // position: 'absolute',
           
            backgroundColor: colors.primary[700],
            '&:hover': {
                backgroundColor: colors.primary[600],
            }
        }}
    >
        {isTimelineCollapsed ?   <ChevronLeftIcon />:<ChevronRightIcon />}
    </IconButton>
    </Box>
      

        <Stepper
          activeStep={activeStepIndex}
          orientation="vertical"
          connector={
            <StepConnector
              sx={{
                // Target the line itself
                "& .MuiStepConnector-line": {
                  // Style for the default (inactive) line
                  borderColor: colors.grey[700],
                  borderWidth: 2,
                  minHeight: "35px",
                  
                },
                // Target the line when its step is active or completed
                "&.Mui-active .MuiStepConnector-line, &.Mui-completed .MuiStepConnector-line":
                  {
                    borderColor: colors.greenAccent[500],
                  },
              }}
            />
          }
        >
          {projectStages.map((stage, index) => {
            const isActive = activeStepIndex === index;
            const timelineIcon = {
              completed: (
                <Avatar
                  sx={{
                    backgroundColor: isActive
                      ? colors.greenAccent[700]
                      : colors.primary[700],
                    color: colors.grey[100],
                    border: `1px solid ${colors.grey[600]}`,
                  }}
                >
                  <CheckCircleIcon sx={{ color: colors.greenAccent[500] }} />
                </Avatar>
              ),
              inProgress: (
                <Avatar
                  sx={{
                    backgroundColor: isActive
                      ? colors.greenAccent[700]
                      : colors.primary[700],
                    color: colors.grey[100],
                    border: `1px solid ${colors.grey[600]}`,
                  }}
                >
                  <Typography fontWeight="bold">{stage.number}</Typography>
                </Avatar>
              ),
              notStarted: (
                <Avatar
                  sx={{
                    backgroundColor: colors.primary[900],
                    color: colors.grey[600],
                    border: `1px solid ${colors.grey[700]}`,
                  }}
                >
                  <Typography fontWeight="bold">{stage.number}</Typography>
                </Avatar>
              ),
            };

            return (
              <Step
                key={stage.id}
                expanded={true}
                sx={{
                  p: 1,
                  borderRadius: "8px",
                  transition: "background-color 0.2s ease-in-out", // Smooth transition

                  // Define the hover state
                  "&:hover": {
                    backgroundColor: colors.primary[900], // Or any color from your theme
                  },
                }}
              >
                <StepLabel
                  onClick={() => setExpanded(stage.id)}
                  icon={timelineIcon[stage.stageStatus]}
                  
                >
                  <Box
                     sx={{
                        opacity: isTimelineCollapsed ? 0 : 1,
                        visibility: isTimelineCollapsed ? 'hidden' : 'visible',
                        whiteSpace: isTimelineCollapsed ? 'nowrap' : '', // Prevents text from wrapping during animation
                        
                        transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
                    }}>
                    <Typography
                      fontWeight="600"

                      color={isActive ? colors.grey[100] : colors.grey[300]}
                    >
                      {stage.title}
                    </Typography>
                    <Typography variant="body2" color={colors.grey[400]}>
                      {stage.formattedDateRange}
                    </Typography>
                    {stage.isCurrent && (
                      <Chip
                        label="Current Stage"
                        size="small"
                        color="success"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
   
      </Box>
      </Box>
    
  );
};

export default ProjectStagesComponent;

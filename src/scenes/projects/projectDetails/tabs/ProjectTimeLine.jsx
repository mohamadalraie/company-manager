import React, { useState, useMemo, useEffect } from "react";
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
  CircularProgress, // 👈 لإظهار مؤشر التحميل
  Button, // 👈 لإظهار زر إعادة المحاولة عند حدوث خطأ
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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddNewStage from "../../../../components/AddStage";
import useProjectStagesData from "../../../../hooks/getAllProjectStagesDataHook"; // 👈 استيراد الـ hook

// --- Helper function to format dates ---
const formatDateRange = (start, end) => {
  if (!start || !end) return "Date not set"; // Handle cases where dates are missing
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

const ProjectStagesComponent = ({ projectId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // --- Data Fetching using the Hook ---
  const { stages: fetchedStages, loading, error, refetchData } = useProjectStagesData(projectId);

  const [isTimelineCollapsed, setIsTimelineCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState([]);

  // --- Effect to update state when data is fetched ---
  useEffect(() => {
    // When fetchedStages data arrives, update the component's state
    if (fetchedStages && fetchedStages.length > 0) {
      setExpanded(fetchedStages[0].id); // Automatically expand the first stage
      setTasks(fetchedStages.flatMap((stage) => stage.tasks)); // Initialize tasks from all stages
    }
  }, [fetchedStages]); // This effect runs whenever fetchedStages changes


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
    if (!fetchedStages) return []; // Return empty array if data is not yet available

    const exampleToday = new Date("2025-06-28"); // Using a fixed date for consistent "Current" stage example

    return fetchedStages.map((stage) => {
      const stageTasks = stage.tasks
        .map((st) => tasks.find((t) => t.id === st.id))
        .filter(Boolean);
      const totalTasksCount = stage.tasks.length;
      const counts = {
        done: stageTasks.filter((t) => t.status === "done").length,
        in_progress: stageTasks.filter((t) => t.status === "in_progress").length,
        waiting: stageTasks.filter((t) => t.status === "waiting").length,
      };

      let stageStatus = "notStarted";
      if (counts.done === totalTasksCount && totalTasksCount > 0) {
        stageStatus = "completed";
      } else if (counts.done > 0 || counts.in_progress > 0 || counts.waiting > 0) {
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
          in_progress: totalTasksCount > 0 ? (counts.in_progress / totalTasksCount) * 100 : 0,
          waiting: totalTasksCount > 0 ? (counts.waiting / totalTasksCount) * 100 : 0,
        },
      };
    });
  }, [fetchedStages, tasks]); // Re-calculate when fetched data or local tasks state changes

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

  // --- Loading State ---
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
        <CircularProgress color="success" />
        <Typography variant="h6" sx={{ ml: 2, color: colors.grey[300] }}>
          Loading Project Stages...
        </Typography>
      </Box>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
        <Typography variant="h5" color="error">
          Failed to load project stages.
        </Typography>
        <Typography color={colors.grey[400]}>
          {error.message}
        </Typography>
        <Button
          onClick={refetchData} // Retry fetching data
          variant="contained"
          sx={{ mt: 2, backgroundColor: colors.blueAccent[600], '&:hover': { backgroundColor: colors.blueAccent[700] } }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // --- Main Return (when data is successfully loaded) ---
  return (
    <Box display="flex" gap={1}>
      {/* Accordion */}
      <Box sx={{ flexGrow: 1 }}>
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
                    backgroundColor: colors.primary[900],
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

                {stage.tasks.length > 0 ? <TasksKanbanView />
                  : (
                    <Typography
                      sx={{ textAlign: "center", color: colors.grey[400], p: 2 }}
                    >
                      There are no Tasks in this Stage
                    </Typography>
                  )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        {/* Pass refetchData to AddNewStage so it can refresh the list after adding a new stage */}
        <AddNewStage projectId={projectId} onStageAdded={refetchData} />
      </Box>

      {/* Side Time Line */}
      <Box
        display="column"
        alignItems={"start"}
        minWidth={isTimelineCollapsed ? "5%" : "25%"}
        width={isTimelineCollapsed ? "5%" : "25%"}
        sx={{
          transition: 'width 0.3s ease-in-out',
          overflowWrap: 'break-all',
        }}
      >
        {/* --- Toggle Button --- */}
        <Box
          display="flex"
          justifyContent="flex-start"
          width="100%"
          sx={{ ml: "10px" }}
        >
          <IconButton
            onClick={() => setIsTimelineCollapsed(!isTimelineCollapsed)}
            sx={{
              backgroundColor: colors.primary[700],
              '&:hover': {
                backgroundColor: colors.primary[600],
              }
            }}
          >
            {isTimelineCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        <Stepper
          activeStep={activeStepIndex}
          orientation="vertical"
          connector={
            <StepConnector
              sx={{
                "& .MuiStepConnector-line": {
                  borderColor: colors.grey[700],
                  borderWidth: 2,
                  minHeight: "35px",
                },
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
                <Avatar sx={{ backgroundColor: isActive ? colors.greenAccent[700] : colors.primary[700], color: colors.grey[100], border: `1px solid ${colors.grey[600]}` }}>
                  <CheckCircleIcon sx={{ color: colors.greenAccent[500] }} />
                </Avatar>
              ),
              inProgress: (
                <Avatar sx={{ backgroundColor: isActive ? colors.greenAccent[700] : colors.primary[700], color: colors.grey[100], border: `1px solid ${colors.grey[600]}` }}>
                  <Typography fontWeight="bold">{stage.number}</Typography>
                </Avatar>
              ),
              notStarted: (
                <Avatar sx={{ backgroundColor: colors.primary[900], color: colors.grey[600], border: `1px solid ${colors.grey[700]}` }}>
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
                  transition: "background-color 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: colors.primary[900],
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
                      whiteSpace: isTimelineCollapsed ? 'nowrap' : '',
                      transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
                      overflow: 'hidden',
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
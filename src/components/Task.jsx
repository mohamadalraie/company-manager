import React, { useState, useMemo } from 'react';
import { Box, Typography, useTheme, Paper, Chip, Avatar,Tooltip } from '@mui/material';
import { tokens } from "../theme"; // Adjust path to your theme file
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Icon for estimated time

// --- 1. Sample Task Data ---
const initialTasks = [
 { id: 'task-1', number: 'T-01', name: "Analyze User Feedback", description: "Review and categorize feedback from the last user survey.", estimated_time: "4h", status: 'not_started' },
  { id: 'task-2', number: 'T-02', name: "Design New Login Flow", description: "Create wireframes and mockups for the SSO integration.", estimated_time: "8h", status: 'in_progress' },
  { id: 'task-2', number: 'T-02', name: "Design New Login Flow", description: "Create wireframes and mockups for the SSO integration.", estimated_time: "8h", status: 'in_progress' },
  { id: 'task-3', number: 'T-03', name: "Fix API Rate Limiting Bug", description: "The /v2/users endpoint is not correctly enforcing rate limits.", estimated_time: "6h", status: 'in_progress' },
  { id: 'task-4', number: 'T-04', name: "Awaiting Legal Approval", description: "Waiting for the legal team to approve the new privacy policy text.", estimated_time: "N/A", status: 'waiting' },
  { id: 'task-5', number: 'T-05', name: "Setup Staging Server", description: "Deploy the latest build to the staging environment for QA testing.", estimated_time: "2h", status: 'not_started' },
  { id: 'task-6', number: 'T-06', name: "Write End-to-End Tests", description: "Cover the entire user registration and profile update flow.", estimated_time: "10h", status: 'done' },
  { id: 'task-7', number: 'T-07', name: "Update Documentation", description: "Reflect the latest API changes in the developer docs.", estimated_time: "3h", status: 'done' },
];

// --- The Kanban Board Component ---
const TasksKanbanView = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tasks, setTasks] = useState(initialTasks);

  // --- 2. Configuration for Column appearance ---
  const columnsConfig = {
    not_started: { title: "Not Started", color: colors.grey[500] },
    in_progress: { title: "In Progress", color: theme.palette.warning.main },
    waiting: { title: "Waiting", color: colors.blueAccent[500] },
    done: { title: "Done", color: colors.greenAccent[500] },
  };

  // Define the order of the columns
  const columnOrder = ['not_started', 'in_progress', 'waiting', 'done'];

  // --- 3. Group tasks by status for rendering ---
  const taskColumns = useMemo(() => {
    const groupedTasks = tasks.reduce((acc, task) => {
      const status = task.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {});
    return groupedTasks;
  }, [tasks]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
      }}
    >
      {/* Map over the defined order to render columns correctly */}
      {columnOrder.map(columnId => {
        const column = columnsConfig[columnId];
        const tasksInColumn = taskColumns[columnId] || [];

        return (
          // --- Column ---
          <Box
            key={columnId}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: colors.primary[900],
              borderRadius: '12px',
            }}
          >
            {/* Column Header */}
            <Box
              sx={{
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: `3px solid ${column.color}`,
              }}
            >
              <Typography variant="h5" fontWeight="600" sx={{ color: colors.grey[100] }}>
                {column.title}
              </Typography>
              <Avatar sx={{ backgroundColor: column.color, color: '#fff', width: 28, height: 28 }}>
                <Typography variant="subtitle2" fontWeight="bold">{tasksInColumn.length}</Typography>
              </Avatar>
            </Box>

            {/* Tasks Container */}
            <Box
              sx={{
                pt: 1.5,
                flexGrow: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {tasksInColumn.map(task => (
                // --- Task Card ---
                <Paper
                  key={task.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    backgroundColor: colors.primary[800],
                    border: `1px solid ${colors.grey[700]}`,
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out', // For a smooth effect

                    // --- Add this for the hover effect ---
                    '&:hover': {
                        cursor: 'pointer', // Show the hand cursor
                        borderColor: column.color   , // Change the border color
                        boxShadow: `0px 0px 10px -5px ${column.color}`, // Add a subtle shadow to "lift" the card
                    },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: colors.grey[100] }}>
                      {task.name}
                    </Typography>
                    <Chip label={task.number} size="small" sx={{ color: colors.grey[300] }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: colors.grey[300], mb: 2 }}>
                    {task.description}
                  </Typography>
                  <Box display={"flex"} justifyContent={"space-between"}>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon sx={{ color: colors.grey[400], fontSize: '1rem' }} />
                    <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                      {task.estimated_time}
                    </Typography>
                    </Box>
                    <Tooltip title="assigned to mohamad alraie"> 
                                       <Avatar sx={{ backgroundColor: column.color, color: '#fff', width: 22, height: 22 }}>
                <Typography variant="subtitle2" fontWeight="bold">{tasksInColumn.length}</Typography>
              </Avatar>
              </Tooltip>

                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default TasksKanbanView;
// src/components/ProjectGridCalendar.js

import React, { useState, useMemo } from "react";
import { 
  Box, Typography, useTheme, CircularProgress, Paper, Chip, Avatar, Tooltip
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; 
import interactionPlugin from "@fullcalendar/interaction";

// --- استيراد الأيقونات والمكونات الخاصة بك ---
import LayersIcon from '@mui/icons-material/Layers';
import useProjectStagesData from "../../../../hooks/getAllProjectStagesDataHook"; // <-- تأكد من صحة المسار
import { tokens } from "../../../../theme"; // <-- تأكد من صحة المسار
import TaskDetailDialog from "../../../../components/TaskDetailsDialog"; // <-- تأكد من صحة المسار

/**
 * دالة لتخصيص شكل عرض الحدث
 */
const renderEventContent = (eventInfo, columnsConfig, theme) => {
  const { type, ...task } = eventInfo.event.extendedProps;
  
  // تصميم خاص بالمراحل
  if (type === 'stage') {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '2px 6px',
        overflow: 'hidden',
        height: '100%',
        // color: '#fff' // لضمان وضوح النص على الخلفية الملونة
        border: '1px solid white', // إضافة حدود بيضاء
        borderRadius: '10px',  
        
      }}>
        <LayersIcon sx={{ mr: 1, fontSize: '0.9rem' }} />
        <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
          {eventInfo.event.title}
        </Typography>
      </Box>
    );
  }
  
  // تصميم خاص بالمهام
  const assigneeName = task.employeeAssigned?.name || 'N/A';
  // مطابقة حالة "Doing" مع البيانات الفعلية
  const taskStatus = task.status === "in_progress" ? "Doing" : task.status;
  const eventColor = columnsConfig[taskStatus]?.color || '#888';

  return (
    <Tooltip title={task.title}>
      <Chip
        avatar={<Tooltip title={`${assigneeName}`}><Avatar sx={{ width: 25, height: 25, fontSize: '0.8rem' }}>{assigneeName.charAt(0)}</Avatar></Tooltip>}
        label={eventInfo.event.title}
        size="small"
        sx={{
          width: '100%',
          justifyContent: 'flex-start',
          cursor: 'pointer',
          backgroundColor: 'rgb(50,55,70)',
          color: theme.palette.getContrastText(eventColor),
          border: '2px solid', 
          borderColor: eventColor,
          color: "white",
          '& .MuiChip-avatar': {
            color: theme.palette.getContrastText(eventColor),
          }
        }}
      />
    </Tooltip>
  );
};


const ProjectGridCalendar = ({ projectId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // تعريف كائن الألوان الخاص بك داخل المكون
  const columnsConfig = {
    ToDo: { title: "To Do", color: colors.grey[500] },
    Doing: { title: "In Progress", color: theme.palette.warning.main },
    pendingApproval: { title: "Waiting", color: colors.blueAccent[500] },
    Done: { title: "Done", color: colors.greenAccent[500] },
  };

  const { stages, loading, error } = useProjectStagesData(projectId);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEventClick = (clickInfo) => {
    const { type, ...taskProps } = clickInfo.event.extendedProps;
    if (type === 'task') {
      setSelectedTask(taskProps);
      setIsDialogOpen(true);
    }
  };

  const calendarEvents = useMemo(() => {
    if (!stages) return [];
    const events = [];

    stages.forEach((stage, stageIndex) => {
      // إضافة خصائص الفرز للمرحلة
      if (stage.startDate && stage.endDate) {
        events.push({
          id: `stage-${stage.id}`,
          title: stage.title,
          start: stage.startDate,
          end: stage.endDate,
          extendedProps: { 
            type: 'stage',
            sortKey_stage: stageIndex, 
            sortKey_isStage: 1,      
          },
          color: colors.blueAccent[700],
          borderColor: colors.blueAccent[400]
        });
      }
      
      // إضافة خصائص الفرز للمهام
      if (stage.tasks) {
        stage.tasks.forEach(task => {
          if (task.start_date && task.dead_line) {
            events.push({
              id: `task-${task.id}`,
              title: task.title || task.type_of_task,
              start: task.start_date,
              end: task.dead_line,
              extendedProps: { 
                type: 'task',
                sortKey_stage: stageIndex, 
                sortKey_isStage: 0,      
                ...task
              },
            });
          }
        });
      }
    });
    return events;
  }, [stages, colors]);
  
  if (loading) return (<Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    sx={{ height: "50vh" }}
  >
    <CircularProgress color="success" />
    <Typography variant="h6" sx={{ ml: 2, color: colors.grey[300] }}>
      Loading Project TimeLine...
    </Typography>
  </Box>);
  if (error) return <Typography color="error">Failed to load data.</Typography>;

  return (
    <Box m="10px">
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: colors.grey[100] }}>
        Project Calendar
      </Typography>
      <Paper elevation={1} sx={{ p: 2, backgroundColor: colors.primary[800], ".fc-license-message": { display: "none" }, }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridYear",
          }}
          events={calendarEvents}
          height="80vh"
          eventContent={(eventInfo) => renderEventContent(eventInfo, columnsConfig, theme)} 
          eventClick={handleEventClick}
          // خاصية الترتيب العمودي للأحداث
          eventOrder="sortKey_stage, -sortKey_isStage, start"
        />
      </Paper>
      
      <TaskDetailDialog
        task={selectedTask}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
      
      <style>{`
        .fc-event {
        //   border: none !important;
          background-color: transparent !important;
          padding: 1px 4px;
        }
        .fc-h-event {
            border: none !important;
            background-color: transparent !important;
        }
        .fc .fc-daygrid-event {
            border-radius: 10px;
            overflow: hidden; /* ضروري ليعمل الـ border-radius على المحتوى */
        }
        .fc .fc-day-other .fc-daygrid-day-top {
          opacity: 0.5;
        }
        /* تلوين خانة تاريخ اليوم الفعلي */
        .fc .fc-day-today {
            background-color: rgba(100, 116, 150, 0.2) !important;
            border: 2px solid ${colors.blueAccent[500]};
        }
      `}</style>
    </Box>
  );
};

export default ProjectGridCalendar;
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
import TaskDetailDialog from "../../../../components/dialogs/TaskDetailsDialog"; // <-- تأكد من صحة المسار
import { useProject } from '../../../../contexts/ProjectContext';
/**
 * دالة لتخصيص شكل عرض الحدث (النسخة المعدّلة)
 */
const renderEventContent = (eventInfo, columnsConfig, theme, colors) => {
  const { type, ...task } = eventInfo.event.extendedProps;

  // --- تصميم جديد للمراحل (Stages) ---
  if (type === 'stage') {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '3px 8px',
        width: '100%',
        height: '100%',
        backgroundColor: colors.primary[600], // خلفية مميزة
       
        border:`1px solid ${colors.greenAccent[500]}`,
        borderLeft: `5px solid ${colors.greenAccent[500]}`, 
        borderRight:`5px solid ${colors.greenAccent[500]}`,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)', // ظل خفيف لإعطاء عمق
      }}>
        <LayersIcon sx={{ mr: 1, fontSize: '1rem', color: colors.greenAccent[400] }} />
        <Typography variant="body2" sx={{ fontWeight: 600, color: colors.grey[100], whiteSpace: 'nowrap' }}>
          {eventInfo.event.title}
        </Typography>
      </Box>
    );
  }

  // --- تصميم جديد للمهام (Tasks) ---
  const assigneeName = task.employeeAssigned?.name || 'N/A';
  const assigneeInitial = assigneeName.charAt(0).toUpperCase();

  // مطابقة حالة "Doing" مع البيانات الفعلية وتوفير لون افتراضي
  const taskStatusKey = task.status === "in_progress" ? "Doing" : task.status;
  const statusConfig = columnsConfig[taskStatusKey] || { color: colors.grey[600], title: 'Unknown' };
  const eventColor = statusConfig.color;

  return (
    <Tooltip title={`${task.title} - Status: ${statusConfig.title}`} placement="top">
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '2px 4px',
        backgroundColor: colors.primary[900], // خلفية داكنة موحدة
        border: '1px solid',
        borderColor: eventColor, // الإطار يأخذ لون الحالة
        borderRadius: '4px',
        color: colors.grey[100],
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: colors.primary[700],
          // The 'augmentColor' utility is useful for generating shades, but might not be available directly on the theme palette by default.
          // A simpler approach is to use a slightly more opaque or different color for hover.
          borderColor: eventColor, // Keep the border color or lighten it manually if needed
        }
      }}>
        {/* شريط صغير ملون يمثل الحالة */}
        <Box sx={{
          width: '4px',
          height: '16px',
          backgroundColor: eventColor,
          borderRadius: '2px',
          mr: 1,
        }} />

        <Typography variant="body2" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {eventInfo.event.title}
        </Typography>

        <Tooltip title={`Assigned to: ${assigneeName}`}>
          <Avatar sx={{
            width: 16,
            height: 16,
            fontSize: '0.6rem',
            m: "3px",
            backgroundColor: eventColor,
            color: theme.palette.getContrastText(eventColor)
          }}>
            {assigneeInitial}
          </Avatar>
        </Tooltip>
      </Box>
    </Tooltip>
  );
};


const ProjectGridCalendar = ({  }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { selectedProjectId } = useProject();

  // تعريف كائن الألوان الخاص بك داخل المكون
  const columnsConfig = {
    ToDo: { title: "To Do", color: colors.grey[500] },
    Doing: { title: "In Progress", color: theme.palette.warning.main },
    pendingApproval: { title: "Waiting", color: colors.blueAccent[500] },
    Done: { title: "Done", color: colors.greenAccent[500] },
  };

  const { stages, loading, error } = useProjectStagesData(selectedProjectId);
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
      if (stage.startDate && stage.endDate) {
        events.push({
          id: `stage-${stage.id}`,
          title: stage.title,
          start: stage.startDate,
          end: stage.endDate,
          allDay: true, // اجعل المراحل تمتد على مدار اليوم بالكامل
          extendedProps: {
            type: 'stage',
            sortKey_stage: stageIndex,
            sortKey_isStage: 1,
          },
        });
      }

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
  }, [stages]);

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
      <Paper elevation={5} sx={{ p: 2, backgroundColor: colors.primary[800], ".fc-license-message": { display: "none" }, }}>
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
          eventContent={(eventInfo) => renderEventContent(eventInfo, columnsConfig, theme, colors)}
          eventClick={handleEventClick}
          eventOrder="sortKey_stage, -sortKey_isStage, start"
        />
      </Paper>

      <TaskDetailDialog
        task={selectedTask}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      {/* --- تعديلات على الـ CSS --- */}
      <style>{`
        /* إزالة الخلفيات والحدود الافتراضية بشكل كامل */
        .fc-event, .fc-h-event {
          background-color: transparent !important;
          border: none !important;
          padding: 0; /* Remove padding from the default event container */
        }
        
        .fc-event .fc-event-main {
            height: 100%; /* Ensure the inner container fills the event */
        }
        
        /* السماح للمحتوى المخصص بملء المساحة المتاحة */
        .fc-daygrid-event-harness {
            padding: 2px 0; /* Add vertical spacing between events */
        }

        .fc .fc-daygrid-day-top {
          flex-direction: row; /* لعرض رقم اليوم والنص بجانب بعض */
        }
        
        /* تلوين خانة تاريخ اليوم الفعلي */
        .fc .fc-day-today {
            background-color: ${colors.primary[300]} !important;
            border: 1px solid ${colors.blueAccent[500]};
        }

        .fc .fc-day-other .fc-daygrid-day-top {
          opacity: 0.5;
        }
      `}</style>
    </Box>
  );
};

export default ProjectGridCalendar;
// src/components/EditTaskDialog.jsx  (أو أي مسار مناسب)

import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  useTheme,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getAuthToken } from "../shared/Permissions";
import { updateTaskApi } from "../shared/APIs"; // **استخدم API التحديث**
import useConsultingEngineersData from "../hooks/getAllConsultingEngineersDataHook";
import { tokens } from "../theme";

// --- Icon Imports ---
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import CategoryIcon from '@mui/icons-material/Category';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';

const EditTaskDialog = ({ open, onClose, task, onTaskUpdated, consultingCompanyId, participants,stageId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    title: "",
    description: "",
    note: "",
    start_date: "",
    dead_line: "",
    status: "",
    type_of_task: "",
    priority: "",
    employee_assigned: "",
    supervisor_id: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { engineers: consultingEngineers, loading: engineersLoading } = useConsultingEngineersData({ consultingCompanyId });

  // دالة لتنسيق التاريخ ليتوافق مع حقل الإدخال
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // تعبئة الفورم ببيانات المهمة عند فتح الديالوج
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        note: task.note || "",
        start_date: formatDateForInput(task.start_date),
        dead_line: formatDateForInput(task.dead_line),
        status: task.status || "",
        type_of_task: task.type_of_task || "",
        priority: task.priority || "",
        employee_assigned: task.employee_assigned?.id || "", // تأكد من استخدام المعرّف الصحيح
        supervisor_id: task.supervisor_id || "",
        status_of_approval:1,
        stage_id:stageId
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Task title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.note.trim()) newErrors.note = "A note is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.dead_line) newErrors.dead_line = "Deadline is required";
    if (!formData.employee_assigned) newErrors.employee_assigned = "Please assign a participant";
    if (!formData.supervisor_id) newErrors.supervisor_id = "Please select a supervisor";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.type_of_task) newErrors.type_of_task = "Type of task is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      // **استخدام PUT و updateTaskApi مع معرّف المهمة**
      const response = await axios.put(`${baseUrl}${updateTaskApi}${task.id}`, formData, config);
      onTaskUpdated(response.data); // إرسال البيانات المحدثة للواجهة الأم
      console.log(response.data);
      handleClose();
    } catch (err) {
      console.error("Failed to update task:", err);
      setErrors({ form: err.response?.data?.message || "An error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const SectionTitle = ({ children, sx }) => (
    <Typography variant="h6" color={colors.greenAccent[400]} sx={{ width: "100%", textAlign: "left", pb: "8px", mb: 3, borderBottom: `1px solid ${colors.grey[700]}`, ...sx }}>
      {children}
    </Typography>
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" PaperProps={{ sx: { backgroundColor: colors.primary[700], color: colors.grey[100], borderRadius: '8px' } }}>
      <DialogTitle sx={{ backgroundColor: colors.primary[800], color: colors.greenAccent[400], fontWeight: 'bold' }}>
        Edit Task
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: colors.primary[800], pt: '20px !important' }}>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <SectionTitle>Basic Information</SectionTitle>
          <Grid container spacing={3}>
             <Grid item xs={12}>
               <TextField name="title" label="Task Title" value={formData.title} onChange={handleChange} error={!!errors.title} helperText={errors.title} fullWidth required InputProps={{ startAdornment: <InputAdornment position="start"><TitleIcon /></InputAdornment> }} />
             </Grid>
             <Grid item xs={12}>
               <TextField name="description" label="Description" value={formData.description} onChange={handleChange} error={!!errors.description} helperText={errors.description} fullWidth required multiline rows={3} InputProps={{ startAdornment: <InputAdornment position="start"><DescriptionIcon /></InputAdornment> }} />
             </Grid>
             <Grid item xs={12}>
               <TextField name="note" label="Additional Notes" value={formData.note} onChange={handleChange} error={!!errors.note} helperText={errors.note} fullWidth required multiline rows={2} InputProps={{ startAdornment: <InputAdornment position="start"><SpeakerNotesIcon /></InputAdornment> }} />
             </Grid>
          </Grid>
          
          <SectionTitle sx={{ mt: 4 }}>Dates</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField name="start_date" label="Start Date" type="date" value={formData.start_date} onChange={handleChange} error={!!errors.start_date} helperText={errors.start_date} fullWidth required InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon /></InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="dead_line" label="Deadline" type="date" value={formData.dead_line} onChange={handleChange} error={!!errors.dead_line} helperText={errors.dead_line} fullWidth required InputLabelProps={{ shrink: true }} InputProps={{ startAdornment: <InputAdornment position="start"><EventIcon color="error" /></InputAdornment> }} />
            </Grid>
          </Grid>

          <SectionTitle sx={{ mt: 4 }}>Assignment</SectionTitle>
          <Grid container spacing={3}>
             <Grid item xs={12} sm={6}>
               <FormControl fullWidth required error={!!errors.employee_assigned}>
                 <InputLabel>Assign to Participant</InputLabel>
                 <Select name="employee_assigned" label="Assign to Participant" value={formData.employee_assigned} onChange={handleChange} startAdornment={<InputAdornment position="start"><PersonPinIcon /></InputAdornment>}>
                   {participants?.map((participant) => (<MenuItem key={participant.id} value={participant.id}>{`${participant.participant.user.first_name} ${participant.participant.user.last_name}`}</MenuItem>))}
                 </Select>
                 {errors.employee_assigned && <Typography color="error" variant="caption" sx={{ pl: 2, mt: 0.5 }}>{errors.employee_assigned}</Typography>}
               </FormControl>
             </Grid>
             <Grid item xs={12} sm={6}>
               <FormControl fullWidth required error={!!errors.supervisor_id}>
                 <InputLabel>Supervisor</InputLabel>
                 <Select name="supervisor_id" label="Supervisor" value={formData.supervisor_id} onChange={handleChange} startAdornment={<InputAdornment position="start"><SupervisorAccountIcon /></InputAdornment>}>
                   {engineersLoading ? <MenuItem disabled>Loading...</MenuItem> : consultingEngineers.map((sup) => (<MenuItem key={sup.id} value={sup.id}>{`${sup.first_name} ${sup.last_name}`}</MenuItem>))}
                 </Select>
                 {errors.supervisor_id && <Typography color="error" variant="caption" sx={{ pl: 2, mt: 0.5 }}>{errors.supervisor_id}</Typography>}
               </FormControl>
             </Grid>
          </Grid>

          <SectionTitle sx={{ mt: 4 }}>Other Details</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required error={!!errors.status}>
                <InputLabel>Status</InputLabel>
                <Select name="status" label="Status" value={formData.status} onChange={handleChange} startAdornment={<InputAdornment position="start"><PlaylistAddCheckIcon /></InputAdornment>}>
                  <MenuItem value="ToDo">To Do</MenuItem>
                  <MenuItem value="Doing">In Progress</MenuItem>
                  <MenuItem value="pendingApproval">Waiting</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
                {errors.status && <Typography color="error" variant="caption" sx={{ pl: 2, mt: 0.5 }}>{errors.status}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required error={!!errors.type_of_task}>
                <InputLabel>Type of Task</InputLabel>
                <Select name="type_of_task" label="Type of Task" value={formData.type_of_task} onChange={handleChange} startAdornment={<InputAdornment position="start"><CategoryIcon /></InputAdornment>}>
                  <MenuItem value="test">Test</MenuItem>
                  <MenuItem value="notTest">Not Test</MenuItem>
                </Select>
                {errors.type_of_task && <Typography color="error" variant="caption" sx={{ pl: 2, mt: 0.5 }}>{errors.type_of_task}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <TextField name="priority" label="Priority (1-5)" type="number" value={formData.priority} onChange={handleChange} error={!!errors.priority} helperText={errors.priority} fullWidth required InputProps={{ inputProps: { min: 1, max: 5 }, startAdornment: <InputAdornment position="start"><LowPriorityIcon /></InputAdornment> }} />
            </Grid>
          </Grid>
          
          {errors.form && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{errors.form}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: colors.primary[800], padding: '16px 24px' }}>
        <Button onClick={handleClose} disabled={isSubmitting} sx={{ color: colors.grey[100], backgroundColor: colors.primary[600], '&:hover': { backgroundColor: colors.primary[500] } }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} /> : null} sx={{ color: colors.primary[100], backgroundColor: colors.greenAccent[600], '&:hover': { backgroundColor: colors.greenAccent[700] } }}>
          {isSubmitting ? "Updating..." : "Update Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskDialog;
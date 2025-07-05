import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Chip, useTheme, Grid, Avatar,
  Divider, Tooltip, IconButton, Menu, MenuItem,
  DialogContentText, CircularProgress, ListItemIcon
} from "@mui/material";
import { tokens } from "../theme";

// --- Icon Imports ---
import EventIcon from '@mui/icons-material/Event';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import CategoryIcon from '@mui/icons-material/Category';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// --- API Imports (استبدلها بالمسارات الصحيحة) ---
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; 
import { getAuthToken } from "../shared/Permissions";
import { deleteTaskApi } from "../shared/APIs";


// Helper component for metadata items in the sidebar
const MetadataItem = ({ icon, label, children }) => {
  const colors = tokens(useTheme().palette.mode);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
      <Box sx={{ color: colors.greenAccent[400] }}>{icon}</Box>
      <Box>
        <Typography variant="body2" color={colors.grey[300]}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="500">
          {children}
        </Typography>
      </Box>
    </Box>
  );
};


const TaskDetailDialog = ({ open, onClose, task, onTaskDeleted }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // --- State for options menu ---
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // --- State for delete confirmation dialog ---
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  // --- Menu handlers ---
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // --- Action handlers ---
  const handleEdit = () => {
    console.log("Editing task:", task.id);
    // Add your edit logic here
    handleMenuClose();
  };
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteDialogClose = () => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!task || !task.id) return;
    setIsDeleting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      await axios.delete(`${baseUrl}${deleteTaskApi}${task.id}`, config);
      
      if(onTaskDeleted) {
        onTaskDeleted(task.id); 
      }
      
      handleDeleteDialogClose();
      onClose(); // Close the detail dialog after successful deletion
    } catch (err) {
      console.error("Failed to delete task:", err);
      // Optionally, show a user-facing error message here
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Status Chip Configuration ---
  const statusConfig = {
    ToDo: { label: "To Do", color: "default", variant: "outlined" },
    Doing: { label: "In Progress", color: "warning", variant: "filled" },
    penApproval: { label: "Waiting", color: "info", variant: "filled" },
    Done: { label: "Done", color: "success", variant: "filled" },
  };
  const currentStatus = statusConfig[task.status] || statusConfig.ToDo;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[800],
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ p: 2.5, borderBottom: `1px solid ${colors.grey[700]}`, backgroundColor: colors.primary[800] }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" fontWeight="bold" sx={{ flexGrow: 1 }}>
              {task.title}
            </Typography>
            <Chip
              label={currentStatus.label}
              color={currentStatus.color}
              variant={currentStatus.variant}
              size="medium"
            />
            <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ backgroundColor: colors.primary[800] }}>
  <Grid container spacing={4} sx={{ pt: 2 }}>
    {/* --- Left Column (Main Content) --- */}
    <Grid item xs={12} md={8}>
      <Box>
        <Typography variant="h6" color={colors.grey[200]} gutterBottom>
          Description
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: colors.grey[300], lineHeight: 1.7, mb: 4 }}
        >
          {task.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <SpeakerNotesIcon sx={{ color: colors.grey[400], mt: 0.5 }} />
          <Box>
            <Typography variant="h6" color={colors.grey[200]} gutterBottom>
              Notes
            </Typography>
            <Typography variant="body1" sx={{ color: colors.grey[300] }}>
              {task.note || "No additional notes."}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Grid>

    {/* --- Right Column (Metadata Sidebar) --- */}
    <Grid
      item
      xs={12}
      md={4}
      sx={{
        borderLeft: { md: `1px solid ${colors.grey[700]}` },
        pl: { md: "32px !important" },
      }}
    >
      <Box>
        <Typography variant="h6" color={colors.grey[200]} sx={{ mb: 2 }}>
          Details
        </Typography>

        <MetadataItem icon={<PersonPinIcon />} label="Assigned To">
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: "0.8rem",
                bgcolor: colors.greenAccent[700],
              }}
            >
              {task.employeeAssigned.name.charAt(0)}
            </Avatar>
            {task.employeeAssigned.name}
          </Box>
        </MetadataItem>

        <MetadataItem icon={<SupervisorAccountIcon />} label="Supervisor">
          {task.supervisor_id || "N/A"}
        </MetadataItem>

        <MetadataItem icon={<CategoryIcon />} label="Task Type">
          {task.type_of_task || "N/A"}
        </MetadataItem>

        <Divider sx={{ my: 2.5 }} />

        <MetadataItem icon={<EventIcon />} label="Start Date">
          {new Date(task.start_date).toLocaleDateString("en-GB")}
        </MetadataItem>

        <MetadataItem icon={<EventIcon />} label="Deadline">
          {new Date(task.dead_line).toLocaleDateString("en-GB")}
        </MetadataItem>

        <MetadataItem icon={<EventIcon />} label="Duration">
          {task.expected_period_to_complete}
        </MetadataItem>
        <MetadataItem
          icon={<EventIcon />}
          label="Date Of Closing The Task"
        >
          {task.actual_date_of_closed === null
            ? "Not closed yet"
            : new Date(task.actual_date_of_closed).toLocaleDateString(
                "en-GB"
              )}
        </MetadataItem>

        <Divider sx={{ my: 2.5 }} />

        <MetadataItem icon={<LowPriorityIcon />} label="Priority">
          {task.priority || "Not Set"}
        </MetadataItem>

        <MetadataItem icon={<CategoryIcon />} label="Task Type">
          {task.type_of_task === "test" ? "Test Task" : "Regular Task"}
        </MetadataItem>
      </Box>
    </Grid>
  </Grid>
</DialogContent>
        <DialogActions sx={{ p: 2, borderTop: `1px solid ${colors.grey[700]}`, backgroundColor: colors.primary[800] }}>
          <Button 
            onClick={onClose} 
            variant="contained" 
            sx={{ 
              color: colors.grey[100], 
              backgroundColor: colors.greenAccent[700], 
              '&:hover': { backgroundColor: colors.grey[700] } 
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Actions Menu --- */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[700],
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: colors.redAccent[400] }}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: colors.redAccent[400] }} /></ListItemIcon>
          Delete
        </MenuItem>
      </Menu>

      {/* --- Delete Confirmation Dialog --- */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[800],
          }
        }}
      >
        <DialogTitle sx={{color: colors.grey[100]}}>Confirm Task Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{color: colors.grey[300]}}>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={isDeleting} sx={{ color: colors.grey[300] }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} color="inherit"/> : null}
            variant="contained"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskDetailDialog;
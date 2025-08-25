// src/components/ProjectMediaTab.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Videocam as VideocamIcon,
} from "@mui/icons-material";
import { tokens } from "../../../theme"; 
import axios from "axios";
import { baseUrl } from "../../../shared/baseUrl";
import { deleteProjectMediaApi } from "../../../shared/APIs";
import { getAuthToken } from "../../../shared/Permissions";

// --- Mock Data ---
const mockMedia = [
    { id: 1, type: "image", url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop" },
    { id: 2, type: "image", url: "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?q=80&w=2071&auto=format&fit=crop" },
    { id: 3, type: "video", url: "http://example.com/video.mp4" }, // Videos won't display, just the icon
    { id: 4, type: "image", url: "https://images.unsplash.com/photo-1511055232023-8c414436a3a4?q=80&w=1974&auto=format&fit=crop" },
    { id: 5, type: "image", url: "https://images.unsplash.com/photo-1581092446347-a84a229a4a75?q=80&w=2070&auto=format&fit=crop" },
    { id: 6, type: "image", url: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=2070&auto=format&fit=crop" },
];


// Media Item Component (No changes needed)
const MediaItem = ({ item, onDeleteClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: "12px",
        overflow: "hidden",
        "&:hover .media-overlay": {
          opacity: 1,
        },
      }}
    >
      {item.type === "image" ? (
        <CardMedia
          component="img"
          height="200"
          image={item.url}
          alt="Project Media"
        />
      ) : (
        <Box
          height="200"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor={colors.primary[900]}
        >
          <VideocamIcon sx={{ fontSize: "4rem", color: colors.grey[500] }} />
        </Box>
      )}
      <Box
        className="media-overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <IconButton
          onClick={() => onDeleteClick(item.id)}
          sx={{ color: "white" }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

// Main Tab Component
const ProjectMediaTab = ({ projectId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // --- Using Mock Data for Demonstration ---
  // In a real scenario, this state would come from your data fetching hook
  const [media, setMedia] = useState(mockMedia);
  const loading = false;
  const error = null;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // A dummy refetch function for the mock data scenario
  const refetchMedia = () => {
      console.log("Refetching media data...");
      // In a real app, this would trigger your data hook to fetch again
  };

  const handleDeleteClick = (id) => {
    setMediaToDelete(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      // This is where you would make the actual API call
      console.log(`Simulating deletion of media item with ID: ${mediaToDelete}`);
      // await axios.delete(`${baseUrl}${deleteProjectMediaApi}/${mediaToDelete}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } });
      
      // For demonstration, we'll just filter the mock data
      setMedia(prevMedia => prevMedia.filter(item => item.id !== mediaToDelete));
      
      refetchMedia(); // This would refetch data from the server in a real app
    } catch (err) {
      console.error("Failed to delete media:", err);
    } finally {
      setIsDeleting(false);
      setOpenConfirm(false);
      setMediaToDelete(null);
    }
  };

  const handleAddMedia = () => {
    alert("This would open a file dialog to upload new media.");
    // After a successful upload, you would call refetchMedia()
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">Failed to load media.</Alert>;

  return (
    <Box p={{ xs: 1, sm: 2, md: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" color={colors.greenAccent[400]}>
          Project Media Gallery
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={handleAddMedia}
          sx={{
            backgroundColor: colors.greenAccent[600],
            "&:hover": { backgroundColor: colors.greenAccent[700] },
          }}
        >
          Add Media
        </Button>
      </Box>

      {media.length > 0 ? (
        <Grid container spacing={2}>
          {media.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <MediaItem item={item} onDeleteClick={handleDeleteClick} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">No media has been added to this project yet.</Alert>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this media item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectMediaTab;
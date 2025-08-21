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
  Close as CloseIcon,
} from "@mui/icons-material";
import { tokens } from "../../../theme"; 
import axios from "axios"; // ستحتاجه لعمليات الحذف والإضافة
import { baseUrl } from "../../../shared/baseUrl"; // تأكد من صحة المسار
import { deleteProjectMediaApi, addProjectMediaApi } from "../../../shared/APIs"; // يجب إضافة هذه المتغيرات
import { getAuthToken } from "../../../shared/Permissions";


// مكون لعرض عنصر الميديا (صورة أو فيديو)
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

// المكون الرئيسي للتبويب
const ProjectMediaTab = ({ projectId, media, loading, error, refetchMedia }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (id) => {
    setMediaToDelete(id);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      // منطق الحذف هنا باستخدام axios
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
      await axios.delete(`${baseUrl}${deleteProjectMediaApi}/${mediaToDelete}`, config); // تأكد من تعريف API الحذف
      
      // بعد الحذف الناجح، أعد جلب البيانات
      refetchMedia();
    } catch (err) {
      console.error("Failed to delete media:", err);
      // يمكنك إضافة تنبيه للمستخدم هنا
    } finally {
      setIsDeleting(false);
      setOpenConfirm(false);
      setMediaToDelete(null);
    }
  };

  // دالة وهمية للإضافة، يمكنك تعديلها لرفع الملفات فعلياً
  const handleAddMedia = () => {
    // هنا تفتح نافذة لاختيار الملفات ثم ترفعها
    alert("سيتم هنا فتح نافذة لإضافة صور أو فيديوهات جديدة.");
    // بعد الإضافة الناجحة، استدعِ refetchMedia()
  };

  if (loading) return <CircularProgress />;
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

      {/* نافذة تأكيد الحذف */}
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
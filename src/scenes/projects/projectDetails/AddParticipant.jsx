// src/components/CustomDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  useTheme,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // أيقونة الإغلاق
import { tokens } from "../../../theme";
import useEngineersData from "../../../hooks/getAllEngineersDataHook";
import { DataGrid } from "@mui/x-data-grid";
import { addParticipantApi } from "../../../shared/APIs";
import { baseUrl } from "../../../shared/baseUrl";
import axios from "axios";

/**
 * مكون Dialog مخصص وقابل لإعادة الاستخدام.
 *
 * @param {object} props - خصائص المكون.
 * @param {boolean} props.open - تحدد ما إذا كان الـ Dialog مفتوحًا أم مغلقًا.
 * @param {function} props.onClose - دالة يتم استدعاؤها عند طلب إغلاق الـ Dialog.
 * @param {string} props.projectId - عنوان الـ Dialog.

 */
const AddParticipant = ({ open, onClose, projectId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // جلب بيانات المهندسين وحالة التحميل والخطأ
  const {
    engineers: rawEngineers,
    loading,
    error,
    refetchEngineers,
  } = useEngineersData();

  // تهيئة بيانات المهندسين: إضافة top-level 'id' للراحة في التعامل
  const engineers = rawEngineers.map((engineer) => ({
    ...engineer,
    // استخدم participant.id كـ ID فريد للمهندس
    id: engineer.participant?.id || engineer.id || Math.random(), // ID احتياطي إذا لم يتوفر
  }));

  // حالة لتخزين الـ ID للمهندس المختار
  const [selectedEngineerId, setSelectedEngineerId] = useState(""); // قيمة ابتدائية فارغة

  // حالة لـ Snackbar (الرسائل المنبثقة)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  // معالج التغيير عند اختيار مهندس من القائمة المنسدلة
  const handleSelectChange = (event) => {
    const newId = event.target.value;
    setSelectedEngineerId(newId);
    console.log("المهندس المختار ID:", newId); // طباعة الـ ID مباشرة
    showSnackbar(`تم اختيار المهندس ذو الـ ID: ${newId}`, "success");
  };

  // وظيفة يمكن استدعاؤها للقيام بشيء بالـ ID المختار (مثل إرساله إلى API)
  const handleSubmitSelection = async () => {
    if (selectedEngineerId) {
      const values = {
        project_id: projectId,
        participant_id: selectedEngineerId,
        participant_type: "engineer",
      };
      try {
        const response = await axios.post(
          `${baseUrl}${addParticipantApi}`,
          values,
          {
            headers: {
              // Add any required headers here (e.g., Authorization token)
            },
          }
        );
        showSnackbar(
          `تم تأكيد المهندس ذو الـ ID: ${selectedEngineerId}`,
          "info"
        );

        console.log(response);
      } catch (error) {
        console.error(
          "Error creating project:",
          error.response?.data || error.message
        );
        const errorMessage =
          error.response?.data?.message ||
          "Failed to create project. Please try again.";
        showSnackbar(
          `تم تأكيد المهندس ذو الـ ID: ${selectedEngineerId}`,
          "info"
        );
      } finally {
        onClose();
      }
    } else {
      showSnackbar("الرجاء اختيار مهندس أولاً.", "warning");
    }
  };

  if (loading) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        // --- Apply custom styles to the Dialog ---
        PaperProps={{
          // Target the Paper component that wraps the dialog content
          sx: {
            backgroundColor: colors.primary[700], // Example: A darker background
            color: colors.grey[100], // Text color for the entire dialog
            borderRadius: "8px", // Rounded corners
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)", // Custom shadow
            minWidth: "70vw",
          },
        }}
        // --- End custom styles for Dialog ---
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress size={60} sx={{ color: colors.greenAccent[400] }} />
          <Typography variant="h6" sx={{ mt: 2, color: colors.grey[500] }}>
            جاري تحميل المهندسين...
          </Typography>
        </Box>
      </Dialog>
    );
  }

  // شاشة الخطأ
  if (error) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        // --- Apply custom styles to the Dialog ---
        PaperProps={{
          // Target the Paper component that wraps the dialog content
          sx: {
            backgroundColor: colors.primary[700], // Example: A darker background
            color: colors.grey[100], // Text color for the entire dialog
            borderRadius: "8px", // Rounded corners
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)", // Custom shadow
            minWidth: "70vw",
          },
        }}
        // --- End custom styles for Dialog ---
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <Typography variant="h5" color="error" sx={{ textAlign: "center" }}>
            خطأ في تحميل البيانات: {error.message}
          </Typography>
          <Button
            onClick={refetchEngineers}
            variant="outlined"
            sx={{
              mt: 2,
              color: colors.blueAccent[500],
              borderColor: colors.blueAccent[500],
            }}
          >
            إعادة المحاولة
          </Button>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Dialog>
    );
  }

  // عرض الواجهة الرئيسية
  return (
    <Dialog
      open={open}
      onClose={onClose}
      // --- Apply custom styles to the Dialog ---
      PaperProps={{
        // Target the Paper component that wraps the dialog content
        sx: {
          backgroundColor: colors.primary[700], // Example: A darker background
          color: colors.grey[100], // Text color for the entire dialog
          borderRadius: "8px", // Rounded corners
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)", // Custom shadow
          minWidth: "70vw",
        },
      }}
      // --- End custom styles for Dialog ---
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          backgroundColor: colors.primary[800], // Header background
          color: colors.greenAccent[400], // Header text color
          fontWeight: "bold",
          padding: "16px 24px",
        }}
        variant="h3"
      >
        Add New Participant to the project
      </DialogTitle>

      <DialogContent
        sx={{
          padding: "24px",
          color: colors.grey[200],
          backgroundColor: colors.primary[800], // Content text color
        }}
      >
        <DialogContentText
          id="alert-dialog-description"
          component="span"
          variant="h5"
        >
          Select the engineer that you want to add to this project as
          participant.
        </DialogContentText>

        <FormControl fullWidth sx={{ mt: 3, mb: 3 }}>
          <InputLabel id="engineer-select-label">participant</InputLabel>
          <Select
            labelId="engineer-select-label"
            id="engineer-select"
            value={selectedEngineerId}
            label="participant"
            onChange={handleSelectChange}
            sx={{
              color: colors.grey[100],
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: colors.grey[400],
              },
            }}
          >
            <MenuItem value=""></MenuItem>
            {engineers.map((engineer) => (
              <MenuItem key={engineer.id} value={engineer.id}>
                {`${engineer.first_name} ${engineer.last_name} (${engineer.specialization_name})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body1" sx={{ mb: 2, color: colors.grey[300] }}>
          Participant id: {selectedEngineerId || "not selected yet"}
        </Typography>

        {/* Snackbar للرسائل */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </DialogContent>
      <DialogActions
        sx={{
          gap: 2,
          backgroundColor: colors.primary[800], // Footer background
          padding: "16px 24px",
        }}
      >
        <Button onClick={onClose} sx={{ color: colors.grey[100] }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmitSelection}
          disabled={!selectedEngineerId} // تعطيل الزر إذا لم يتم اختيار مهندس
          sx={{
            backgroundColor: colors.greenAccent[700],
            color: colors.primary[100],
            "&:hover": {
              backgroundColor: colors.greenAccent[800],
            },
          }}
        >
          submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddParticipant;

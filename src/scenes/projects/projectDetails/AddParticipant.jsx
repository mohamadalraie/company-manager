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
  TextField,   // New! TextField is now used inside Autocomplete
  Autocomplete, // New! Import Autocomplete
} from "@mui/material";
import { useState } from "react";
import { tokens } from "../../../theme";
import useEngineersData from "../../../hooks/getAllEngineersDataHook";
import { addParticipantApi } from "../../../shared/APIs";
import { baseUrl } from "../../../shared/baseUrl";
import axios from "axios";
import { getAuthToken } from "../../../shared/Permissions";
import { useProject } from "../../../contexts/ProjectContext";

const AddParticipant = ({ open, onClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { selectedProjectId } = useProject();

  const config = {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  };

  const {
    engineers: rawEngineers,
    loading,
    error,
    refetchEngineers,
  } = useEngineersData();
  
  // Engineer data prepared for Autocomplete
  const engineers = rawEngineers.map((engineer) => ({
    ...engineer,
    id: engineer.participant?.id || engineer.id,
    label: `${engineer.first_name} ${engineer.last_name} (${engineer.specialization_name})`,
  }));

  // State to store the selected engineer OBJECT
  const [selectedEngineer, setSelectedEngineer] = useState(null);

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

  // Handler for form submission
  const handleSubmitSelection = async () => {
    if (selectedEngineer) {
      const values = {
        project_id: selectedProjectId,
        participant_id: selectedEngineer.id,
        participant_type: "engineer",
      };
      try {
        const response = await axios.post(`${baseUrl}${addParticipantApi}`, values, config);
        showSnackbar(`Successfully added participant: ${selectedEngineer.label}`, "success");
        console.log(response);
      } catch (error) {
        console.error("Error creating participant:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.message || "Failed to add participant.";
        showSnackbar(errorMessage, "error");
      } finally {
        onClose(); // Close dialog after submission attempt
      }
    } else {
      showSnackbar("Please select an engineer first.", "warning");
    }
  };

  // Loading and Error states remain the same...
  if (loading) {
     return <Dialog open={open} onClose={onClose} PaperProps={{ sx: { backgroundColor: colors.primary[700] } }}><Box p={5} display="flex" alignItems="center" gap={2}><CircularProgress /><Typography>Loading Engineers...</Typography></Box></Dialog>;
  }
  if (error) {
     return <Dialog open={open} onClose={onClose} PaperProps={{ sx: { backgroundColor: colors.primary[700] } }}><Box p={5}><Typography color="error">Error: {error.message}</Typography><Button onClick={refetchEngineers}>Retry</Button></Box></Dialog>;
  }


  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: colors.primary[800],
          color: colors.grey[100],
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          minWidth: { xs: "90vw", md: "50vw" }, // Responsive width
        },
      }}
    >
      <DialogTitle
        sx={{
          color: colors.greenAccent[400],
          fontWeight: "bold",
        }}
        variant="h3"
      >
        Add Participant to Project
      </DialogTitle>

      <DialogContent sx={{ padding: "24px" }}>
        <DialogContentText sx={{ color: colors.grey[300], mb: 3 }} variant="h5">
          Search for an engineer by name or specialization to add them as a participant.
        </DialogContentText>
        
        {/* --- New Autocomplete Component for Searching --- */}
        <Autocomplete
          fullWidth
          options={engineers}
          value={selectedEngineer}
          onChange={(event, newValue) => {
            setSelectedEngineer(newValue);
          }}
          getOptionLabel={(option) => option.label || ""}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search & Select Engineer"
              variant="outlined"
            />
          )}
          sx={{
            // Style the popup menu
            "& .MuiAutocomplete-paper": {
                backgroundColor: colors.primary[700],
                color: colors.grey[100],
            },
            // Style the input field
            "& .MuiInputBase-root": {
                color: colors.grey[100],
            },
          }}
        />

        <Typography variant="body1" sx={{ mt: 3, color: colors.grey[300] }}>
          Selected Participant ID: {selectedEngineer?.id || "not selected yet"}
        </Typography>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </DialogContent>
      
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button onClick={onClose} sx={{ color: colors.grey[100] }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmitSelection}
          disabled={!selectedEngineer} // Disable if no engineer is selected
          sx={{
            backgroundColor: colors.greenAccent[700],
            color: colors.primary[100],
            "&:hover": { backgroundColor: colors.greenAccent[800] },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddParticipant;
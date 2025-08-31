import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";

// --- Action Icons ---
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

// --- Import Components ---
import { Header } from "../../../../components/Header";
import DeleteConfirmationComponent from "../../../../components/DeleteConfirmation";
import AddParticipant from "../AddParticipant";
import UserCard from "../../../../components/UserCard";
import AddTicketDialog from "../../../../components/dialogs/AddTicketDialog";

// --- Other Imports ---
import { baseUrl } from "../../../../shared/baseUrl";
import { deleteParticipantApi } from "../../../../shared/APIs";
import { havePermission } from "../../../../shared/Permissions";

const TeamTab = ({ participants }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for Add Participant Dialog
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);
  
  // State for the Add Ticket Dialog
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [selectedEngineerId, setSelectedEngineerId] = useState(null);

  // Handlers for Add Participant Dialog
  const handleOpenAddParticipant = () => setIsAddParticipantOpen(true);
  const handleCloseAddParticipant = () => setIsAddParticipantOpen(false);
  
  // Handlers for the Add Ticket Dialog
  const handleOpenTicketDialog = (engineerId) => {
    setSelectedEngineerId(engineerId);
    setIsTicketDialogOpen(true);
  };

  const handleCloseTicketDialog = () => {
    setIsTicketDialogOpen(false);
    setSelectedEngineerId(null);
  };
  
  const handleTicketSuccess = () => {
    showSnackbar("Ticket created successfully!", "success");
    // You can also add a function here to refetch tickets if needed
  };

  // Process participants data
  const formattedData = participants.reduce((acc, participant) => {
    const user = participant.participant.user;
    const formattedParticipant = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number,
      specialization_name: user.first_name, // You might want to adjust this field
    };
  
    if (participant.participant_type === 'project_manager') { 
      acc.projectManager = formattedParticipant;
    } else if (participant.participant_type === 'engineer') {
      acc.formatedEngineers.push(formattedParticipant);
    }
  
    return acc;
  }, { formatedEngineers: [], projectManager: null });
  
  const { formatedEngineers, projectManager } = formattedData;

  // State and handlers for Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "first_name", headerName: "First Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "last_name", headerName: "Last Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "specialization_name", headerName: "Specialization", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            gap={1}
          >
            {/* {havePermission("create ticket") && ( */}
              <Tooltip title="Add Ticket">
                <IconButton onClick={() => {handleOpenTicketDialog(params.row.id);
                  console.log(params.row.id)}}>
                  <ConfirmationNumberIcon sx={{ color: colors.blueAccent[400] }} />
                </IconButton>
              </Tooltip>
            {/* )} */}

            {havePermission("delete project participant") && (
              <DeleteConfirmationComponent
                itemId={params.row.id}
                deleteApi={`${baseUrl}${deleteParticipantApi}`}
                onDeleteSuccess={() => {
                  showSnackbar("Engineer deleted successfully!", "success");
                  // refetch logic should be called here
                }}
                onDeleteError={(errorMessage) => {
                  showSnackbar(`Failed to delete engineer: ${errorMessage}`, "error");
                }}
                icon={<DeleteOutlineIcon sx={{ color: colors.redAccent[500] }} />}
                confirmationText="Are you sure you want to delete this engineer?"
              />
            )}
          </Box>
        );
      },
    },
  ];

  if (!projectManager) {
    return (
      <Box p={3}>
        <Typography>Loading team data or no project manager assigned...</Typography>
      </Box>
    );
  }

  return (
    <Box m="10px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header
          title={"Participants"}
          subtitle={"Managing the engineers participating in the project."}
        />
        {havePermission("assign project participant") && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[700],
              color: colors.primary[100], "&:hover": { backgroundColor: colors.greenAccent[800] },
            }}
            startIcon={<AddIcon />}
            onClick={handleOpenAddParticipant}
          >
            Add Participant
          </Button>
        )}
      </Box>

      <UserCard
        label="Project Manager"
        firstName={projectManager.first_name}
        lastName={projectManager.last_name}
        email={projectManager.email}
        phoneNumber={projectManager.phone_number}
        address={"N/A"}
      />
      <Box mt="30px" mb="15px">
        <Header
          title={"Engineers"}
          subtitle={"All the Engineers in the project"}
        />
      </Box>

      <EngineersDataGrid columns={columns} formatedEngineers={formatedEngineers} />

      <AddParticipant
        open={isAddParticipantOpen}
        onClose={handleCloseAddParticipant}
      />
      
      <AddTicketDialog
        open={isTicketDialogOpen}
        onClose={handleCloseTicketDialog}
        onSuccess={handleTicketSuccess}
        relatedId={selectedEngineerId}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const EngineersDataGrid = ({ formatedEngineers, columns }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      m="20px 0 0 0"
      height="70vh"
      sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .name-column--cell": { fontWeight: "bold" },
        "& .MuiDataGrid-columnHeaders": {
          color: colors.greenAccent[400],
          borderBottom: "none",
          fontWeight: "bold",
        },
      }}
    >
      <DataGrid
        rows={formatedEngineers}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 20]}
      />
    </Box>
  );
};

export default TeamTab;
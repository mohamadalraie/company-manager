import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { tokens } from "../../../../theme";
import useProjectFilesData from "../../../../hooks/getProjectFilesDataHook";
import DeleteConfirmationComponent from "../../../../components/DeleteConfirmation";
import { deleteProjectFileApi } from "../../../../shared/APIs";
import { baseUrl } from "../../../../shared/baseUrl";
import { Header } from "../../../../components/Header";
import AddProjectFile from "../AddFile"; // Import the new Dialog component
import { havePermission } from "../../../../shared/Permissions";

const DocumentsTab = ({ projectId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { projectFiles, loading, error, refetchFiles } = useProjectFilesData({
    projectId: projectId,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const [openViewer, setOpenViewer] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState("");
  const [currentFileName, setCurrentFileName] = useState("");
  const [currentFileType, setCurrentFileType] = useState("");
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false); // State for the AddFileDialog

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

  const handleOpenViewer = (fileUrl, fileName, fileType) => {
    setCurrentFileUrl(fileUrl);
    setCurrentFileName(fileName);
    setCurrentFileType(fileType);
    setOpenViewer(true);
  };

  const handleCloseViewer = () => {
    setOpenViewer(false);
    setCurrentFileUrl("");
    setCurrentFileName("");
    setCurrentFileType("");
  };

  const handleDownloadFile = (fileUrl, fileName) => {
    try {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar(`Downloading: ${fileName}`, "success");
    } catch (error) {
      console.error("Failed to download file:", error);
      showSnackbar(`Failed to download: ${fileName}`, "error");
    }
  };

  const handleOpenAddFileDialog = () => {
    setIsAddFileDialogOpen(true);
  };

  const handleCloseAddFileDialog = () => {
    setIsAddFileDialogOpen(false);
  };

  if (loading) {
    return (
      <Box
        m="20px"
        p="20px"
        sx={{
          backgroundColor: colors.primary[800],
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: colors.greenAccent[400] }} />
        <Typography variant="h6" sx={{ mt: 2, color: colors.grey[500] }}>
          Loading project files...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        m="20px"
        p="20px"
        sx={{
          backgroundColor: colors.primary[800],
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color="error" sx={{ textAlign: "center" }}>
          Error loading files: {error.message || "An unknown error occurred."}
        </Typography>
        <Button
          onClick={refetchFiles}
          variant="outlined"
          sx={{
            mt: 2,
            color: colors.blueAccent[500],
            borderColor: colors.blueAccent[500],
          }}
        >
          Retry
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
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[800],
        borderRadius: "18px",
        minHeight: "300px",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
      >
        <Header
          title={"Project Files"}
          subtitle={"Managing the Files of the project"}
        />
        {havePermission("export reports resource management") && (
          <Button
            variant="contained"
            onClick={handleOpenAddFileDialog}
            sx={{
              backgroundColor: colors.greenAccent[700],
              color: colors.primary[100],
              "&:hover": {
                backgroundColor: colors.greenAccent[800],
              },
            }}
          >
            Add File
          </Button>
        )}
      </Box>
      <Typography
        variant="h4"
        mb={3}
        sx={{
          color: colors.greenAccent[300],
          fontWeight: "bold",
          borderBottom: `1px solid ${colors.grey[700]}`,
          pb: 1,
        }}
      >
        Project Files (Project ID: {projectId})
      </Typography>

      {projectFiles.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography
            variant="h6"
            sx={{ color: colors.grey[400], textAlign: "center", mt: 4 }}
          >
            No files found for this project.
          </Typography>
        </Box>
      ) : (
        <List sx={{ mt: 2 }}>
          {projectFiles.map((file, index) => (
            <React.Fragment key={file.id}>
              <ListItem
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  py: 2,
                  px: 0,
                  "&:hover": {
                    backgroundColor: colors.primary[800],
                    borderRadius: "8px",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "40px", mb: { xs: 1, sm: 0 } }}>
                  <FilePresentIcon
                    sx={{ color: colors.blueAccent[300], fontSize: "2rem" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ color: colors.grey[100] }}>
                      {file.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{ color: colors.grey[300], mt: 0.5 }}
                    >
                      {file.description || "No description available."}
                    </Typography>
                  }
                  sx={{ flexGrow: 1, mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }}
                />
                {file.type === "pdf" ||
                file.type === "png" ||
                file.type === "jpg" ||
                file.type === "jpeg" ||
                file.type === "gif" ||
                file.type === "svg" ? (
                  <Box
                    display="flex"
                    gap={1}
                    flexDirection={{ xs: "column", sm: "row" }}
                    minWidth={{ xs: "100%", sm: "auto" }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() =>
                        handleOpenViewer(file.file_path, file.name, file.type)
                      }
                      sx={{
                        backgroundColor: colors.blueAccent[600],
                        color: colors.primary[100],
                        "&:hover": { backgroundColor: colors.blueAccent[700] },
                        flexGrow: 1,
                      }}
                    >
                      View
                    </Button>
                    {file.type === "pdf" && (
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() =>
                          handleDownloadFile(file.file_path, file.name)
                        }
                        sx={{
                          backgroundColor: colors.greenAccent[600],
                          color: colors.primary[100],
                          "&:hover": {
                            backgroundColor: colors.greenAccent[700],
                          },
                          flexGrow: 1,
                        }}
                      >
                        Download
                      </Button>
                    )}
                    {havePermission("delete reports resource management") && (
                      <DeleteConfirmationComponent
                        itemId={file.id}
                        deleteApi={`${baseUrl}${deleteProjectFileApi}`}
                        onDeleteSuccess={() => {
                          showSnackbar("File deleted successfully!", "success");
                          refetchFiles();
                        }}
                        onDeleteError={(errorMessage) => {
                          showSnackbar(
                            `Failed to delete file: ${errorMessage}`,
                            "error"
                          );
                        }}
                        icon={
                          <DeleteOutlineIcon
                            sx={{ color: colors.redAccent[500] }}
                          />
                        }
                        confirmationText="Are you sure you want to delete this file?"
                      />
                    )}
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() =>
                      handleDownloadFile(file.file_path, file.name)
                    }
                    sx={{
                      backgroundColor: colors.greenAccent[600],
                      color: colors.primary[100],
                      "&:hover": { backgroundColor: colors.greenAccent[700] },
                      minWidth: { xs: "100%", sm: "auto" },
                    }}
                  >
                    Download
                  </Button>
                )}
              </ListItem>
              {index < projectFiles.length - 1 && (
                <Divider
                  component="li"
                  sx={{ borderColor: colors.grey[700] }}
                />
              )}
            </React.Fragment>
          ))}
        </List>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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

      <Dialog
        open={openViewer}
        onClose={handleCloseViewer}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: colors.primary[800],
            color: colors.grey[100],
          },
        }}
      >
        <DialogTitle
          sx={{
            color: colors.grey[100],
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Viewing: {currentFileName}
          <IconButton
            aria-label="close"
            onClick={handleCloseViewer}
            sx={{
              color: colors.grey[100],
              "&:hover": {
                color: colors.blueAccent[400],
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{ backgroundColor: colors.primary[900], p: 0 }}
        >
          {currentFileType === "pdf" && (
            <iframe
              src={currentFileUrl}
              title={`PDF Viewer for ${currentFileName}`}
              width="100%"
              height="700px"
              style={{ border: "none" }}
            >
              <p style={{ padding: "20px", color: colors.grey[300] }}>
                Your browser does not support embedded PDFs. You can{" "}
                <a
                  href={currentFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: colors.blueAccent[300] }}
                >
                  download {currentFileName} here
                </a>
                .
              </p>
            </iframe>
          )}
          {(currentFileType === "png" ||
            currentFileType === "jpg" ||
            currentFileType === "jpeg" ||
            currentFileType === "gif" ||
            currentFileType === "svg") && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
              }}
            >
              <img
                src={currentFileUrl}
                alt={`Image: ${currentFileName}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "calc(100vh - 150px)",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
          )}
          {!(
            currentFileType === "pdf" ||
            currentFileType === "png" ||
            currentFileType === "jpg" ||
            currentFileType === "jpeg" ||
            currentFileType === "gif" ||
            currentFileType === "svg"
          ) && (
            <Box sx={{ p: 3, textAlign: "center", color: colors.grey[300] }}>
              <Typography variant="body1">
                This file type cannot be previewed directly. Please use the
                download option.
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  handleDownloadFile(currentFileUrl, currentFileName);
                  handleCloseViewer();
                }}
                sx={{
                  mt: 2,
                  backgroundColor: colors.greenAccent[600],
                  color: colors.primary[100],
                  "&:hover": { backgroundColor: colors.greenAccent[700] },
                }}
              >
                Download {currentFileName}
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <AddProjectFile
        open={isAddFileDialogOpen}
        onClose={handleCloseAddFileDialog}
        projectId={projectId}
        onUploadSuccess={refetchFiles} // Callback to refetch files after successful upload
      />
    </Box>
  );
};

export default DocumentsTab;

// src/scenes/projects/path/to/tabs/MaterialsTab.jsx

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";

import StraightenIcon from "@mui/icons-material/Straighten"; // أيقونة للوحدة (Unit)
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined"; // أيقونة للكمية
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

// --- Icon Imports ---
import CategoryIcon from "@mui/icons-material/Category";

// --- Theme, API, Hooks, and Custom Components ---
import { tokens } from "../../../../theme";
import { Header } from "../../../../components/Header";

import axios from "axios";
import { baseUrl } from "../../../../shared/baseUrl";
import { getAuthToken } from "../../../../shared/Permissions";
import {
  addExistingItemToProjectContainer,
  createNewItemApi,
} from "../../../../shared/APIs"; // افترض وجود createNewItemApi
import { SelectAndAddItemDialog } from "../../../../components/SelectItemDialog";
import useProjectItemsData from "../../../../hooks/getAllProjectItemsDataHook";

const MaterialsTab = ({ projectId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { materials, loading, error, refetchMaterials } = useProjectItemsData({
    projectId: projectId,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [expectedQuantity, setExpectedQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const categories = useMemo(() => {
    if (!materials) return [];
    return Array.from(new Set(materials.map((m) => m.category)));
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    if (!materials) return [];
    return materials
      .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((m) =>
        selectedCategory ? m.category === selectedCategory : true
      );
  }, [materials, searchTerm, selectedCategory]);

  const handleOpenQuantityDialog = (material) => {
    setSelectedMaterial(material);
    setExpectedQuantity("");
    setSubmitError(null);
    setIsQuantityDialogOpen(true);
  };

  const handleCloseQuantityDialog = () => {
    setIsQuantityDialogOpen(false);
    setSelectedMaterial(null);
  };

  const handleConfirmAndAddItem = async () => {
    if (!expectedQuantity || parseFloat(expectedQuantity) <= 0) {
      setSubmitError("Please enter a valid, positive quantity.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        item_id: selectedMaterial.id,
        expected_quantity: parseFloat(expectedQuantity),
      };
      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      await axios.post(
        `${baseUrl}${addExistingItemToProjectContainer}${projectId}`,
        payload,
        config
      );

      setFeedback({
        open: true,
        message: `Successfully added ${selectedMaterial.name} to the project!`,
        severity: "success",
      });
      handleCloseQuantityDialog();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred.";
      setSubmitError(errorMessage);
      setFeedback({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaterialAdded = () => {
    refetchMaterials();
    setIsAddDialogOpen(false);
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[800],
        borderRadius: "12px",
        p: 3,
        mt: 1,
      }}
    >
      <Header
        title="Project Expected Materials"
        subtitle="Browse the materials that we would use in our project"
      />

      <Box mt="20px">
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{ mb: 4 }}
            >
              <TextField
                label="Search by material name..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Filter by Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setIsAddDialogOpen(true)}
                sx={{
                  flexShrink: 0,
                  backgroundColor: colors.greenAccent[700],
                  color: colors.primary[100],
                  "&:hover": { backgroundColor: colors.greenAccent[800] },
                }}
              >
                Add Material
              </Button>
            </Stack>
            <Grid container spacing={3}>
              {filteredMaterials.map((material) => (
                <Grid item key={material.id} xs={12} sm={6} md={4}>
                  <MaterialCard material={material} />
                </Grid>
              ))}
              {filteredMaterials.length === 0 && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  You didn't add any material to the project yet.
                </Alert>
              )}
            </Grid>
          </>
        )}
      </Box>

      {selectedMaterial && (
        <Dialog open={isQuantityDialogOpen} onClose={handleCloseQuantityDialog}>
          <DialogTitle
            sx={{
              backgroundColor: colors.primary[800],
              color: colors.greenAccent[400],
            }}
          >
            Enter Expected Quantity for{" "}
            <Typography component="span" color="white" fontWeight="bold">
              {selectedMaterial.name}
            </Typography>
          </DialogTitle>
          <DialogContent
            sx={{ backgroundColor: colors.primary[800], pt: "20px !important" }}
          >
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              name="expected_quantity"
              label="Expected Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={expectedQuantity}
              onChange={(e) => setExpectedQuantity(e.target.value)}
              InputProps={{ inputProps: { min: 1 } }}
            />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: colors.primary[800] }}>
            <Button
              onClick={handleCloseQuantityDialog}
              disabled={isSubmitting}
              sx={{ color: colors.grey[100] }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAndAddItem}
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: colors.greenAccent[700],
                "&:hover": { backgroundColor: colors.greenAccent[800] },
              }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Confirm & Add"}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <SelectAndAddItemDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onConfirm={handleMaterialAdded}
        projectId={projectId}
        existingProjectMaterials={materials}
      />

      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.severity}
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MaterialsTab;

const MaterialCard = ({ material }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Card
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: colors.primary[700],
        border: `1px solid ${colors.grey[700]}`,
        borderRadius: "12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: `0px 8px 15px -5px ${colors.greenAccent[800]}`,
          borderColor: colors.greenAccent[700],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 1 }}>
        {/* --- قسم العنوان والفئة --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>
            {material.name}
          </Typography>
          <Chip
            icon={<CategoryIcon />}
            label={material.category}
            size="small"
            sx={{
              backgroundColor: colors.primary[600],
              color: colors.grey[200],
            }}
          />
        </Box>

        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />

        {/* --- قسم التفاصيل (الوحدة والكمية) --- */}
        <Stack spacing={1.5}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <StraightenIcon sx={{ color: colors.greenAccent[400] }} />
            <Typography variant="body2" color={colors.grey[300]}>
              Unit:{" "}
              <Typography
                component="span"
                fontWeight="bold"
                color={colors.grey[100]}
              >
                {material.unit}
              </Typography>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Inventory2OutlinedIcon sx={{ color: colors.greenAccent[400] }} />
            <Typography variant="body2" color={colors.grey[300]}>
              Expected quantity:{" "}
              <Typography
                component="span"
                fontWeight="bold"
                color={colors.grey[100]}
              >
                {material.expected_quantity}
              </Typography>
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      {/* يمكنك إضافة CardActions هنا إذا احتجت أزرارًا في المستقبل */}
      {/* <CardActions sx={{ mt: 'auto' }}>
            <Button size="small">Action</Button>
        </CardActions> 
        */}
    </Card>
  );
};

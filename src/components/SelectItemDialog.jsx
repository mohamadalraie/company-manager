import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useMaterialsData from "../hooks/getAllItemsDataHook";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getAuthToken } from "../shared/Permissions";
import { tokens } from "../theme";

// The main dialog component remains the same
export const SelectAndAddItemDialog = ({
  open,
  onClose,
  onConfirm,
  projectId,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { materials, loading, error, refetchMaterials } = useMaterialsData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isNestedDialogOpen, setIsNestedDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMaterialForConfirmation, setSelectedMaterialForConfirmation] =
    useState(null);

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

  const handleOpenConfirmationDialog = (material) => {
    setSelectedMaterialForConfirmation(material);
    setIsNestedDialogOpen(true);
  };

  const handleCloseConfirmationDialog = () => {
    setIsNestedDialogOpen(false);
  };

  const handleConfirmSelection = () => {
    onConfirm(selectedMaterialForConfirmation);
    handleCloseConfirmationDialog();
  };

  const handleMaterialAdded = () => {
    refetchMaterials();
    setIsAddDialogOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      sx={{
       
        backgroundColor: colors.primary[800],
        color: colors.greenAccent[400],
        fontWeight: "bold",
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: colors.primary[800],
          color: colors.greenAccent[400],
          fontWeight: "bold",
        }}
      >
        Select Material from Inventory
      </DialogTitle>

      <DialogContent
        sx={{ backgroundColor: colors.primary[800], pt: "20px !important" }}
      >
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
              sx={{ mt: 2, mb: 4 }}
            >
              {/* Search, Filter, and Add Button... no changes here */}
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
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => setIsAddDialogOpen(true)}
                sx={{
                 
                  flexShrink: 0,
                  backgroundColor: colors.greenAccent[700],
                  color: colors.primary[100],
                  "&:hover": {
                    backgroundColor: colors.greenAccent[800],
                  },
                }}
              >
                Add New
              </Button>
            </Stack>

            <Grid container spacing={2}>
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <Grid item key={material.id} xs={12} sm={6} md={4}>
                    <Card
                    elevation={0}
                  sx={{
                    p: 1,
                    backgroundColor: colors.primary[700],
                    border: `1px solid ${colors.grey[700]}`,
                    borderRadius: "8px",
                    transition: "all 0.2s ease-in-out", // For a smooth effect

                    // --- Add this for the hover effect ---
                    "&:hover": {
                      cursor: "pointer", // Show the hand cursor
                      borderColor: colors.greenAccent[700], // Change the border color
                      boxShadow: `0px 0px 10px -5px ${colors.greenAccent[700]}`, // Add a subtle shadow to "lift" the card
                    },
                  }}
                    >
                      
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6"         color= {colors.greenAccent[400]}
        fontWeight= "bold">
                          {material.name}
                        </Typography>
                        <Typography  color= {colors.grey[200]} fontSize="small"  gutterBottom>
                          Category: {material.category}
                        </Typography>
                        <Typography
                          variant="h6"
                          color= {colors.grey[200]} fontSize="small"
                          
                        >
                         Unit Price ${material.price}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                        
                          fullWidth
                          onClick={() => handleOpenConfirmationDialog(material)}
                          sx={{
                            backgroundColor: colors.greenAccent[700],
                            color: colors.primary[100],
                            "&:hover": {
                              backgroundColor: colors.greenAccent[800],
                            },
                          }}
                        >
                          Select
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 3 }}>
                    No materials match your search criteria.
                  </Alert>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{ backgroundColor: colors.primary[800], pt: "20px !important" }}
      >
        <Button onClick={onClose}               sx={{
                color: colors.primary[100],
                "&:hover": {
                  backgroundColor: colors.primary[700],
                },
              }}>cancel</Button>
      </DialogActions>

      {selectedMaterialForConfirmation && (
        // Nested Confirmation Dialog... no changes here
        <></>
      )}

      {/* The Add New Dialog now handles multiple steps */}
      <AddNewMaterialDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onMaterialAdded={handleMaterialAdded}
        projectId={projectId}
      />
    </Dialog>
  );
};

// ====================================================================
// MODIFIED Sub-component for the "Add New Material" Dialog (Multi-Step)
// ====================================================================
const initialFormData = {
  name: "",
  category: "",
  price: "",
  "quantity-available": "",
  "expected-quantity": "",
  "consumed-quantity": "",
  "required-quantity": "",
  "remaining-quantity": "",
};

const AddNewMaterialDialog = ({
  open,
  onClose,
  onMaterialAdded,
  projectId,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (!formData.name || !formData.category || !formData.price) {
      setSubmitError("Please fill in all fields in this step.");
      return;
    }
    setSubmitError(null);
    setStep(2);
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  const handleCloseAndReset = () => {
    onClose();
    // We delay the reset to prevent content from disappearing during the closing animation
    setTimeout(() => {
      setStep(1);
      setFormData(initialFormData);
      setSubmitError(null);
    }, 300);
  };

  const handleSubmit = async () => {
    // Simple validation for the second step
    if (!formData["quantity-available"] || !formData["expected-quantity"]) {
      setSubmitError("Please fill in all quantity fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const finalData = {
        ...formData,
        price: parseFloat(formData.price),
        "quantity-available": parseFloat(formData["quantity-available"]),
        "expected-quantity": parseFloat(formData["expected-quantity"]),
        "consumed-quantity": parseFloat(formData["consumed-quantity"] || 10),
        "required-quantity": parseFloat(formData["required-quantity"] || 0),
        "remaining-quantity": parseFloat(formData["remaining-quantity"] || 0),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      };

      await axios.post(
        `${baseUrl}/api/ProjectContainer/createNewItems/${projectId}`,
        finalData,
        config
      );

      onMaterialAdded();
      handleCloseAndReset(); // Close and reset the form on success
    } catch (err) {
      console.error("Failed to create new item:", err);
      setSubmitError("Failed to add material. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseAndReset}
      sx={{ color: colors.greenAccent[400], fontWeight: "bold" }}
    >
      <DialogTitle
        sx={{
          backgroundColor: colors.primary[800],
          color: colors.greenAccent[400],
          fontWeight: "bold",
        }}
      >
        {step === 1
          ? "Add New Material (Step 1 of 2)"
          : "Enter Quantity Details (Step 2 of 2)"}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: colors.primary[800] }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {step === 1 && (
          <Stack spacing={2} sx={{ pt: 1, mt: 1, minWidth: { sm: 400 } }}>
            <Typography variant="subtitle2" color="text.secondary">
              Basic Information
            </Typography>
            <TextField
              name="name"
              label="Material Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Stack>
        )}

        {step === 2 && (
          <Stack spacing={2} sx={{ pt: 1, mt: 1, minWidth: { sm: 400 } }}>
            <Typography variant="subtitle2" color="text.secondary">
              Quantity Information
            </Typography>
            <TextField
              name="quantity-available"
              label="Quantity Available"
              type="number"
              value={formData["quantity-available"]}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="expected-quantity"
              label="Expected Quantity"
              type="number"
              value={formData["expected-quantity"]}
              onChange={handleInputChange}
              fullWidth
              required
            />

          </Stack>
        )}
      </DialogContent>
      <DialogActions
        sx={{ backgroundColor: colors.primary[800], pt: "20px !important" }}
      >
        {step === 1 && (
          <>
            <Button
              onClick={handleCloseAndReset}
              sx={{
                color: colors.primary[100],
                "&:hover": {
                  backgroundColor: colors.primary[700],
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNextStep}
              variant="contained"
              sx={{
                backgroundColor: colors.greenAccent[700],
                color: colors.primary[100],
                "&:hover": {
                  backgroundColor: colors.greenAccent[800],
                },
              }}
            >
              Next
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Button
              onClick={handlePreviousStep}
              disabled={isSubmitting}
              sx={{
                color: colors.primary[100],
                "&:hover": {
                  backgroundColor: colors.primary[700],
                },
              }}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitting}
              sx={{
                backgroundColor: colors.greenAccent[700],
                color: colors.primary[100],
                "&:hover": {
                  backgroundColor: colors.greenAccent[800],
                },
              }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

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
  useTheme,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useMaterialsData from "../../hooks/getAllItemsDataHook";
import axios from "axios";
import { baseUrl } from "../../shared/baseUrl";
import { getAuthToken } from "../../shared/Permissions";
import { tokens } from "../../theme";
import { addExistingItemToProjectContainer, addItemToProjectInventoryApi } from "../../shared/APIs"; 
import AddNewMaterialDialog from "./AddNewMaterialDialog";
import { useProject } from '../../contexts/ProjectContext';

export const SelectAndAddItemToInventoryDialog = ({
  open,
  onClose,
  onConfirm,
  
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { materials, loading, error, refetchMaterials } = useMaterialsData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { selectedProjectId } = useProject();


  const categories = useMemo(() => {
    // Categories should be derived from the available (unselected) materials
    if (!materials) return [];
    return Array.from(new Set(materials.map((m) => m.category)));
  }, [materials]);

  // --- Step 3: Apply search and category filters on the already filtered 'availableMaterials' list ---
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
    setQuantity("");
    setSubmitError(null);
    setIsQuantityDialogOpen(true);
  };

  const handleCloseQuantityDialog = () => {
    setIsQuantityDialogOpen(false);
    setSelectedMaterial(null);
  };

  const handleConfirmAndAddItem = async () => {
    if (!quantity || parseFloat(quantity) <= 0) {
      setSubmitError("Please enter a valid, positive quantity.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        items:[{
        item_id: selectedMaterial.id,
        quantity: parseFloat(quantity),
      }]};
      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      await axios.post(`${baseUrl}${addItemToProjectInventoryApi(selectedProjectId)}`, payload, config);

      onConfirm(selectedMaterial);
      handleCloseQuantityDialog();
      
    } catch (err) {
      console.error("Failed to add existing item to project:", err);
      setSubmitError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaterialAdded = () => {
    refetchMaterials();
    setIsAddDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ backgroundColor: colors.primary[800], color: colors.greenAccent[400], fontWeight: 'bold' }}>
          Select Material
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: colors.primary[800], pt: "20px !important" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}><CircularProgress /></Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 2, mb: 4 }}>
                <TextField label="Search by material name..." variant="outlined" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <FormControl fullWidth>
                  <InputLabel>Filter by Category</InputLabel>
                  <Select value={selectedCategory} label="Filter by Category" onChange={(e) => setSelectedCategory(e.target.value)}>
                    <MenuItem value=""><em>All Categories</em></MenuItem>
                    {categories.map((cat) => (<MenuItem key={cat} value={cat}>{cat}</MenuItem>))}
                  </Select>
                </FormControl>
                {/* <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setIsAddDialogOpen(true)} sx={{ flexShrink: 0, backgroundColor: colors.greenAccent[700], color: colors.primary[100], '&:hover': { backgroundColor: colors.greenAccent[800] } }}>
                  Add New
                </Button> */}
              </Stack>
              <Grid container spacing={2}>
                {/* <-- The list now iterates over 'filteredMaterials' which already excludes existing items */}
                {filteredMaterials.map((material) => (
                  <Grid item key={material.id} xs={12} sm={6} md={4}>
                    <Card elevation={0} sx={{ p: 1, backgroundColor: colors.primary[700], border: `1px solid ${colors.grey[700]}`, borderRadius: "8px", '&:hover': { cursor: "pointer", borderColor: colors.greenAccent[700], boxShadow: `0px 0px 10px -5px ${colors.greenAccent[700]}` } }}>
                      <CardContent>
                        <Typography variant="h6" color={colors.greenAccent[400]} fontWeight="bold">{material.name}</Typography>
                        <Typography color={colors.grey[200]} fontSize="small" gutterBottom>Category: {material.category}</Typography>
                        <Typography variant="h6" color={colors.grey[200]} fontSize="small">Unit: {material.unit}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" fullWidth onClick={() => handleOpenQuantityDialog(material)} sx={{ backgroundColor: colors.greenAccent[700], color: colors.primary[100], '&:hover': { backgroundColor: colors.greenAccent[800] } }}>
                          Select
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {filteredMaterials.length === 0 && (
                <Alert severity="info" sx={{ mt: 3 }}>
                    No more materials available to add, or none match your filter.
                </Alert>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ backgroundColor: colors.primary[800] }}>
          <Button onClick={onClose} sx={{ color: colors.grey[100], '&:hover': { backgroundColor: colors.primary[700] } }}>Cancel</Button>
        </DialogActions>
      </Dialog>
      
      {/* ... (The rest of the dialogs remain the same) ... */}
      {selectedMaterial && (
        <Dialog open={isQuantityDialogOpen} onClose={handleCloseQuantityDialog}>
         <DialogTitle sx={{ backgroundColor: colors.primary[800], color: colors.greenAccent[400] }}>
           Enter Quantity for <Typography component="span" color="white" fontWeight="bold">{selectedMaterial.name}</Typography>
         </DialogTitle>
         <DialogContent sx={{ backgroundColor: colors.primary[800], pt: "20px !important" }}>
           {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
           <TextField
             autoFocus
             margin="dense"
             name="quantity"
             label="Quantity"
             type="number"
             fullWidth
             variant="outlined"
             value={quantity}
             onChange={(e) => setQuantity(e.target.value)}
             InputProps={{ inputProps: { min: 1 } }}
           />
         </DialogContent>
         <DialogActions sx={{ backgroundColor: colors.primary[800] }}>
           <Button onClick={handleCloseQuantityDialog} disabled={isSubmitting} sx={{ color: colors.grey[100] }}>Cancel</Button>
           <Button onClick={handleConfirmAndAddItem} variant="contained" disabled={isSubmitting} sx={{ backgroundColor: colors.greenAccent[700], '&:hover': { backgroundColor: colors.greenAccent[800] } }}>
             {isSubmitting ? <CircularProgress size={24} /> : "Confirm & Add"}
           </Button>
         </DialogActions>
        </Dialog>
      )}

      {/* <AddNewMaterialDialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onMaterialAdded={handleMaterialAdded} /> */}
    </>
  );
};
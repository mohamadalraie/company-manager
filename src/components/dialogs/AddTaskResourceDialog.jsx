import React, { useState, useMemo } from "react";
import {
  Dialog, Divider, DialogTitle, DialogContent, DialogActions, Button, Box,
  Typography, TextField, FormControl, InputLabel, Select, MenuItem, Chip,
  Grid, Card, CardContent, CardActions, CircularProgress, Alert, Stack, useTheme
} from "@mui/material";

import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import StraightenIcon from "@mui/icons-material/Straighten";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { tokens } from "../../theme";
import useMaterialsData from "../../hooks/getAllItemsDataHook";
import axios from "axios";
import { baseUrl } from "../../shared/baseUrl";
import { getAuthToken } from "../../shared/Permissions";
import { addResourceToTask } from "../../shared/APIs";



// ====================================================================
// == 1. المكون الابن (الكارت) - أصبح للعرض فقط
// ====================================================================
const MaterialCard = ({ material, onAddClick }) => {
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>{material.name}</Typography>
          <Chip icon={<CategoryIcon />} label={material.category} size="small" sx={{ backgroundColor: colors.primary[600], color: colors.grey[200] }} />
        </Box>
        <Divider sx={{ my: 2, borderColor: colors.grey[600] }} />
        <Stack spacing={1.5}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <StraightenIcon sx={{ color: colors.greenAccent[400] }} />
            <Typography variant="body2" color={colors.grey[300]}>Unit: <Typography component="span" fontWeight="bold" color={colors.grey[100]}>{material.unit}</Typography></Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Inventory2OutlinedIcon sx={{ color: colors.greenAccent[400] }} />
            <Typography variant="body2" color={colors.grey[300]}>Expected quantity: <Typography component="span" fontWeight="bold" color={colors.grey[100]}>{material.expected_quantity}</Typography></Typography>
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ mt: 'auto' }}>
        {/* الزر الآن يستدعي دالة من المكون الأب ويمرر له بيانات المادة */}
        <Button
          onClick={() => onAddClick(material)}
          fullWidth
          startIcon={<AddIcon />}
          sx={{ backgroundColor: colors.greenAccent[700], color: colors.primary[100], "&:hover": { backgroundColor: colors.greenAccent[800] } }}
          size="small"
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
};


// ====================================================================
// == 2. المكون الأب (الديالوج الرئيسي) - هو الذي يتحكم في كل شيء
// ====================================================================
export const AddResourceDialog = ({ open, onClose, taskId, onResourceAdded }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // الـ hook الآن يستخدم selectedProjectId من الـ Context
  const { materials: projectMaterials, loading: projectLoading } = useMaterialsData(); 

  // هذا الـ hook لا نحتاجه هنا لأننا سنمرر الموارد الموجودة من المكون الذي يستدعي هذا الديالوج
  // const { resources: taskResources, loading: taskLoading } = useTaskResources({ taskId });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // --- كل حالات الديالوج الخاص بالكمية موجودة هنا في المكون الأب ---
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ... (useMemo and other logic remain here)
  const categories = useMemo(() => {
    if (!projectMaterials) return [];
    return Array.from(new Set(projectMaterials.map((m) => m.category)));
  }, [projectMaterials]);

  const filteredMaterials = useMemo(() => {
    if (!projectMaterials) return [];
    return projectMaterials
      .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((m) => selectedCategory ? m.category === selectedCategory : true);
  }, [projectMaterials, searchTerm, selectedCategory]);

  // --- هذه الدالة هي التي يتم تمريرها للمكون الابن ---
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

  const handleConfirmAndAdd = async () => {
    // ... (منطق الإرسال للـ API يبقى كما هو)
    if (!quantity || parseFloat(quantity) <= 0) {
      setSubmitError("Please enter a valid quantity.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = { items_id: selectedMaterial.id, task_id: taskId, quantity: parseFloat(quantity) };
      const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
      await axios.post(`${baseUrl}${addResourceToTask}`, payload, config);
      onResourceAdded();
      handleCloseQuantityDialog();
      onClose();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to add resource.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ backgroundColor: colors.primary[800], color: colors.greenAccent[400] }}>Add Resource to Task</DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[800] }}>
          <Stack spacing={2} my={2}>
            <TextField label="Search available materials..." fullWidth variant="outlined" size="small" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} label="Category" onChange={(e) => setSelectedCategory(e.target.value)}>
                <MenuItem value=""><em>All</em></MenuItem>
                {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
          
          {projectLoading ? <CircularProgress /> : (
            <Box sx={{ height: '50vh', overflowY: 'auto', p:0.5 }}>
              <Grid container spacing={2}>
                {filteredMaterials.length > 0 ? filteredMaterials.map(material => (
                  <Grid item xs={12} sm={6} key={material.id}>
                    {/* تمرير دالة التحكم إلى المكون الابن */}
                    <MaterialCard 
                      material={material} 
                      onAddClick={handleOpenQuantityDialog} 
                    />
                  </Grid>
                )) : (
                  <Grid item xs={12}><Alert severity="info">No materials available.</Alert></Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[800] }}>
          <Button onClick={onClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      
      {/* الديالوج الخاص بالكمية يتم التحكم به من هنا */}
      {selectedMaterial && (
        <Dialog open={isQuantityDialogOpen} onClose={handleCloseQuantityDialog}>
          <DialogTitle sx={{ backgroundColor: colors.primary[800], color: colors.greenAccent[400] }}>Set Quantity for {selectedMaterial.name}</DialogTitle>
          <DialogContent sx={{ backgroundColor: colors.primary[800], pt: "20px !important", minWidth: '350px' }}>
            {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
            <TextField autoFocus margin="dense" name="quantity" label="Quantity" type="number" fullWidth variant="outlined" value={quantity} onChange={(e) => setQuantity(e.target.value)} InputProps={{ inputProps: { min: 1 } }} />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: colors.primary[800] }}>
            <Button onClick={handleCloseQuantityDialog} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleConfirmAndAdd} variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={24} /> : "Confirm"}</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
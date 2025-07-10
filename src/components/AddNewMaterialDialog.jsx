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
import { getAuthToken } from "../shared/Permissions";
import { createNewItemApi } from "../shared/APIs";
import { baseUrl } from "../shared/baseUrl";
import { useState } from "react";
import { tokens } from "../theme";
import axios from "axios";


// ====================================================================
const initialFormData = {
    name: "",
    category: "",
    unit: "",
    expected_quantity: "",
  
  };
  
  const AddNewMaterialDialog = ({ open, onClose, onMaterialAdded ,projectId}) => {
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
      if (!formData.name || !formData.category || !formData.unit) {
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
      setTimeout(() => {
        setStep(1);
        setFormData(initialFormData);
        setSubmitError(null);
      }, 300);
    };
  
    const handleSubmit = async () => {
      if (!formData.expected_quantity) {
        setSubmitError("Please fill in the expected_quantity.");
        return;
      }
  
      setIsSubmitting(true);
      setSubmitError(null);
  
      try {
        const finalData = {
          name: formData.name,
          category: formData.category,
          unit: formData.unit, // Make sure 'unit' is in your form if needed
          expected_quantity: formData.expected_quantity ,
        };

        console.log(finalData);
  
        const config = { headers: { Authorization: `Bearer ${getAuthToken()}` } };
        
        // ملاحظة: تم تعديل مسار الـ API ليكون عاماً ولا يعتمد على projectId
        await axios.post(`${baseUrl}${createNewItemApi}${projectId}`, finalData, config);
  
        onMaterialAdded();
        handleCloseAndReset();
      } catch (err) {
        console.error("Failed to create new item:", err);
        setSubmitError(err.response?.data?.message || "Failed to add material. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <Dialog open={open} onClose={handleCloseAndReset}>
        <DialogTitle sx={{ backgroundColor: colors.primary[800], color: colors.greenAccent[400], fontWeight: "bold" }}>
          {step === 1 ? "Add New Material (Step 1 of 2)" : "Enter Quantity (Step 2 of 2)"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[800] }}>
          {submitError && <Alert severity="error" sx={{ my: 2 }}>{submitError}</Alert>}
  
          {step === 1 && (
            <Stack spacing={2} sx={{ pt: 1, mt: 1, minWidth: { sm: 400 } }}>
              <Typography variant="subtitle2" color="text.secondary">Basic Information</Typography>
              <TextField name="name" label="Material Name" value={formData.name} onChange={handleInputChange} fullWidth required />
              <TextField name="category" label="Category" value={formData.category} onChange={handleInputChange} fullWidth required />
              <TextField name="unit" label="Measurement Unit" value={formData.unit} onChange={handleInputChange} fullWidth required />
            </Stack>
          )}
  
          {step === 2 && (
            <Stack spacing={2} sx={{ pt: 1, mt: 1, minWidth: { sm: 400 } }}>
              <Typography variant="subtitle2" color="text.secondary">Initial Quantity</Typography>
              <TextField name="expected_quantity" label="Expected quantity" type="number" value={formData.expected_quantity} onChange={handleInputChange} fullWidth required />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[800], p: 2 }}>
          {step === 1 && (
            <>
              <Button onClick={handleCloseAndReset} sx={{ color: colors.grey[100] }}>Cancel</Button>
              <Button onClick={handleNextStep} variant="contained" sx={{ backgroundColor: colors.greenAccent[700], '&:hover': { backgroundColor: colors.greenAccent[800] } }}>Next</Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button onClick={handlePreviousStep} disabled={isSubmitting} sx={{ color: colors.grey[100] }}>Back</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting} sx={{ backgroundColor: colors.greenAccent[700], '&:hover': { backgroundColor: colors.greenAccent[800] } }}>
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Save to Inventory"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    );
  };

  export default AddNewMaterialDialog;
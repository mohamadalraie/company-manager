import React, { useState, useMemo } from "react";
import {
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  useTheme,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { SelectAndAddItemDialog } from "../../../../components/dialogs/SelectItemDialog";
import useProjectItemsData from "../../../../hooks/getAllProjectItemsDataHook";
import { tokens } from "../../../../theme";
// Helper component for displaying an icon with text
const InfoItem = ({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
    {icon}
    <Typography variant="body2" sx={{ ml: 1 }}>{text}</Typography>
  </Box>
);

const ProjectInventory = ({  }) => {
  const { items, loading, error, refetchItems } = useProjectItemsData({ });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');


  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleMaterialConfirm = (material) => {
    setSelectedMaterial(material);
    refetchItems();
    handleCloseDialog();
  };

  const categories = useMemo(() => {
    if (!items) return [];
    return Array.from(new Set(items.map((item) => item.category)));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    return items
      .filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((item) =>
        selectedCategory ? item.category === selectedCategory : true
      );
  }, [items, searchTerm, selectedCategory]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Project Materials
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: colors.greenAccent[700],
            color: colors.primary[100],
            "&:hover": {
              backgroundColor: colors.greenAccent[800],
            },
          }}
          startIcon={<LibraryAddIcon />}
          onClick={handleOpenDialog}
        >
          Add Item To the Inventory
        </Button>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          label="Search by material name..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl fullWidth sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Filter by Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {selectedMaterial && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Last selected item: <strong>{selectedMaterial.name}</strong>
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Failed to load project items.</Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item) => {
            const consumedPercentage = item["expected-quantity"] > 0
              ? (item["consumed-quantity"] / item["expected-quantity"]) * 100
              : 0;
            
            const getProgressColor = () => {
                if (consumedPercentage > 90) return colors.redAccent[500];
                if (consumedPercentage > 70) return colors.orangeAccent[500];
                return colors.greenAccent[600];
            };

            return (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: colors.primary[700],
                    border: `1px solid ${colors.grey[700]}`,
                    borderRadius: "12px",
                    transition: "all 0.2s ease-in-out",
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    "&:hover": {
                      cursor: "pointer",
                      borderColor: getProgressColor(),
                      boxShadow: `0px 4px 12px -5px ${getProgressColor()}`,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 0 }}>
                    {/* --- HEADER SECTION --- */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h5" component="div" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Chip
                        label={item.category}
                        icon={<CategoryIcon />}
                        size="small"
                        sx={{ backgroundColor: colors.primary[600], color: colors.grey[100] }}
                      />
                    </Box>

                    {/* --- PRICE INFO --- */}
                    <InfoItem
                      icon={<AttachMoneyIcon fontSize="small" />}
                      text={`Unit Price: $${item.price}`}
                    />

                    {/* --- QUANTITY DETAILS SECTION --- */}
                    <Box 
                      sx={{ 
                        mt: 2, 
                        p: 1.5,
                        backgroundColor: colors.primary[800],
                        borderRadius: '8px',
                        border: `1px solid ${colors.grey[800]}`
                      }}
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <InfoItem icon={<InventoryIcon fontSize="small" />} text={`Available: ${item['quantity-available']}`} />
                        </Grid>
                        <Grid item xs={6}>
                           <InfoItem icon={<TrackChangesIcon fontSize="small" />} text={`Required: ${item['required-quantity']}`} />
                        </Grid>
                      </Grid>
                    </Box>

                  </CardContent>
                  
                  {/* --- PROGRESS BAR SECTION --- */}
                  <Box sx={{ mt: 'auto', pt: 2 }}>
                    <Tooltip title={`Consumed: ${item['consumed-quantity']} | Expected:  ${item['expected-quantity']}`}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Typography variant="body2" color="text.secondary">
                                Consumption
                           </Typography>
                           <Typography variant="body2" fontWeight="bold" color={getProgressColor()}>
                             {`${Math.round(consumedPercentage)}%`}
                           </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={consumedPercentage}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            mt: 0.5,
                            backgroundColor: colors.primary[900],
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getProgressColor(),
                            },
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </Box>

                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {isDialogOpen && (
        <SelectAndAddItemDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          onConfirm={handleMaterialConfirm}
        />
      )}
    </>
  );
};

export default ProjectInventory;
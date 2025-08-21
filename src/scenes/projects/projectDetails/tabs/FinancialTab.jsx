import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    useTheme,
    IconButton,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from "../../../../theme";
import useProjectBills from '../../../../hooks/getProjectBillsDataHook';

// --- أيقونات جديدة ---
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'; // --- أيقونة جديدة ---
import { Header } from '../../../../components/Header';

// ====================================================================
// ==  مكون تفاصيل الفاتورة (للاستخدام في البطاقة والنافذة المنبثقة)
// ====================================================================
const BillDetails = ({ bill, colors }) => (
    // ... هذا المكون يبقى كما هو بدون تغيير
    <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: `1px solid ${colors.grey[600]}` }}>
            <Box>
                <Typography variant="h4" component="div" fontWeight="600">
                    {bill.description}
                </Typography>
                <Typography sx={{ mt: 1 }} >
                    Date of Payment: {bill.date}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body1" color="text.secondary">
                   Total Value
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
                    ${bill.totalCost.toFixed(2)}
                </Typography>
            </Box>
        </Box>


        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ backgroundColor: 'transparent' }}>
            <Table aria-label="bill details">
                <TableHead sx={{ backgroundColor: colors.primary[800] }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: '600' }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: '600' }}>Description</TableCell>
                        <TableCell align="right" sx={{ fontWeight: '600' }}>Cost</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody  sx={{ backgroundColor: colors.primary[600] }}>
                    {bill.details.map((detail) => (
                        <TableRow key={detail.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {detail.item}
                            </TableCell>
                            <TableCell>{detail.note}</TableCell>
                            <TableCell align="right">${detail.cost.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>
);


// ====================================================================
// ==  مكون بطاقة الفاتورة (بتصميم محسن)
// ====================================================================
const BillCard = ({ bill, onOpenDetails }) => {
    // ... هذا المكون يبقى كما هو بدون تغيير
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Card
            elevation={0}
            sx={{
                p: 2,
                backgroundColor: colors.primary[600],
                border: `1px solid ${colors.grey[700]}`,
                borderRadius: "12px",
                transition: "all 0.2s ease-in-out",
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                "&:hover": {
                    borderColor: colors.greenAccent[400],
                    boxShadow: `0px 4px 15px -5px ${colors.greenAccent[400]}`,
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 1 }}>
                {/* --- HEADER --- */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <ReceiptLongIcon sx={{ color: colors.greenAccent[400] }} />
                        <Typography variant="h5" component="div" fontWeight="bold">
                            {bill.description}
                        </Typography>
                    </Stack>
                </Box>

                <Divider sx={{ my: 2, borderColor: colors.grey[700] }} />

                {/* --- DETAILS --- */}
                <Stack spacing={1.5} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="secondary" />
                        <Typography variant="body2" color="text.secondary">Date: {bill.date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoneyIcon fontSize="small" color="secondary" />
                        <Typography variant="body2" color="text.secondary">
                            Total cost: <b style={{ color: colors.greenAccent[400] }}>${bill.totalCost.toFixed(2)}</b>
                        </Typography>
                    </Box>
                </Stack>

            </CardContent>

            {/* --- ACTION BUTTON --- */}
            <Box sx={{ mt: 'auto', pt: 2, px: 1 }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => onOpenDetails(bill)}
                    sx={{
                        backgroundColor: colors.greenAccent[600],
                        color: colors.grey[100],
                        '&:hover': {
                            backgroundColor: colors.greenAccent[700]
                        }
                    }}
                >
                    Details
                </Button>
            </Box>
        </Card>
    );
};


// ====================================================================
// == المكون الرئيسي
// ====================================================================
const FinancialTab = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { bills, loading, error } = useProjectBills();

    const [viewMode, setViewMode] = useState('card');
    const [selectedBill, setSelectedBill] = useState(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    
    // --- حالات الفلترة الجديدة ---
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // --- تحديث منطق الفلترة ليشمل نطاق التاريخ ---
    const filteredBills = useMemo(() => {
        if (!bills) return [];

        return bills.filter(bill => {
            // تحويل تاريخ الفاتورة لتسهيل المقارنة
            const billDate = new Date(bill.date);
            billDate.setHours(0, 0, 0, 0); // تجاهل الوقت

            // فلترة بالوصف
            const descriptionMatch = bill.description.toLowerCase().includes(searchTerm.toLowerCase());

            // فلترة بتاريخ البدء
            const startDateMatch = !startDate || billDate >= new Date(startDate);

            // فلترة بتاريخ الانتهاء
            const endDateMatch = !endDate || billDate <= new Date(endDate);

            return descriptionMatch && startDateMatch && endDateMatch;
        });
    }, [bills, searchTerm, startDate, endDate]);

    // --- دالة لإعادة تعيين كل الفلاتر ---
    const clearFilters = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
    };

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setViewMode(newView);
        }
    };

    const handleOpenDetails = (bill) => {
        setSelectedBill(bill);
        setIsDetailDialogOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailDialogOpen(false);
        setSelectedBill(null);
    };

    const columns = [
        // ... الأعمدة تبقى كما هي
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "description", headerName: "Description", flex: 2, cellClassName: "name-column--cell" },
        { field: "date", headerName: "Invoice Date", flex: 1 },
        {
            field: "totalCost", headerName: "Total value", type: 'number', flex: 1, align: 'left', headerAlign: 'left',
            renderCell: (params) => (
                <Box sx={{ width: '100%', height: '100%', display: "flex", alignItems: 'center', justifyContent: 'left' }}>
                    <Typography color={colors.greenAccent[500]} fontWeight="bold">${params.value.toFixed(2)}</Typography>
                </Box>
            )
        },
        {
            field: 'actions', headerName: 'Actions', flex: 1, align: 'center', headerAlign: 'center', sortable: false,
            renderCell: ({ row }) => (
                <Button variant="outlined" size="small" onClick={() => handleOpenDetails(row)}>
                    Details
                </Button>
            )
        }
    ];

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ mt: 2 }}>Error, Please try again.</Alert>;

    return (
        <Box sx={{ width: '100%', mt: 2, p: 2, backgroundColor: colors.primary[700], borderRadius: "12px" }}>
            
            <Header title="Project Invoices" />

            <Stack spacing={2} sx={{ mt: 3, mb: 4, p: 2, backgroundColor: colors.primary[800], borderRadius: '8px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md sx={{ flexGrow: 1 }}>
                        <TextField
                            fullWidth
                            label="Search by Invoice DESCRIPTION"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            fullWidth
                            label="Search from"
                            type="date"
                            variant="outlined"
                            size="small"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            label="to"
                            type="date"
                            variant="outlined"
                            size="small"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <IconButton onClick={clearFilters} title="إلغاء الفلاتر">
                            <FilterAltOffIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={12} md={1} justifyContent='flex-end'>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', }}>
                <ToggleButtonGroup value={viewMode} exclusive onChange={handleViewChange}>
                    <ToggleButton value="table" aria-label="Table view"><ViewListIcon /></ToggleButton>
                    <ToggleButton value="card" aria-label="Card view"><ViewModuleIcon /></ToggleButton>
                </ToggleButtonGroup>
            </Box>
                    </Grid>
                </Grid>
            </Stack>



            {/* --- عرض البيانات --- */}
            {!bills || bills.length === 0 ? (
                <Box sx={{ mt: 2, p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">There is no Invoices to view</Typography>
                </Box>
            ) : filteredBills.length === 0 ? (
                <Box sx={{ mt: 2, p: 3, textAlign: 'center' }}>
                     <Typography variant="h6">There is no matching Invoices</Typography>
                </Box>
            ) : (
                <>
                    {viewMode === 'table' ? (
                        
                        <Box m="20px 0 0 0" height="75vh" sx={{ /* ... styles */ }}>
                        <DataGrid
                            rows={filteredBills}
                            columns={columns}
                            getRowId={(row) => row.id}
                        />
                    </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredBills.map((bill) => (
                                <Grid item xs={12} sm={6} md={4} key={bill.id}>
                                    <BillCard bill={bill} onOpenDetails={handleOpenDetails} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </>
            )}

            {/* --- نافذة عرض التفاصيل الكاملة --- */}
            {selectedBill && (
                <Dialog open={isDetailDialogOpen} onClose={handleCloseDetails} fullWidth maxWidth="md" >
                   <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold',backgroundColor:colors.primary[500] }}>
                        Invoice Details
                        <IconButton onClick={handleCloseDetails} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers sx={{backgroundColor:colors.primary[500]}}>
                        <BillDetails bill={selectedBill} colors={colors} />
                    </DialogContent>
                    <DialogActions sx={{backgroundColor:colors.primary[500]}}>
                        <Button onClick={handleCloseDetails} variant="contained" >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default FinancialTab;
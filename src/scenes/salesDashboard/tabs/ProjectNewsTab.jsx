import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Grid,
    useTheme,
    IconButton,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Avatar,
    Divider,
    CardActions
} from '@mui/material';
import { tokens } from "../../../theme";
import { Header } from '../../../components/Header';

// --- أيقونات ---
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// ====================================================================
// == بيانات وهمية (لاستبدالها بـ API Hook الخاص بك)
// ====================================================================
// ملاحظة: قم باستبدال هذا الجزء بالـ Hook الفعلي لجلب بيانات الأخبار
const useProjectNews = () => {
    const [news, setNews] = useState([
        { id: 1, title: 'Project Kick-off Meeting', content: 'The initial kick-off meeting was held today with all stakeholders. Key milestones and deliverables were discussed and agreed upon.', date: '2025-08-22', author: 'John Doe' },
        { id: 2, title: 'Phase 1 Completion', content: 'We are pleased to announce the successful completion of Phase 1. The development team has delivered all features as per the requirements.', date: '2025-08-20', author: 'Jane Smith' },
        { id: 3, title: 'New UI/UX Designs Approved', content: 'The new user interface and experience designs have been approved by the client. Implementation will begin next week.', date: '2025-08-18', author: 'John Doe' },
    ]);
    const loading = false;
    const error = null;

    // دالة وهمية لإعادة تحميل البيانات
    const refetchNews = () => console.log("Refetching news...");

    return { news, loading, error, refetchNews };
};


// ====================================================================
// ==  مكون بطاقة الخبر
// ====================================================================
const NewsCard = ({ item, colors, onDelete }) => (
    <Card
        elevation={0}
        sx={{
            backgroundColor: colors.primary[600],
            border: `1px solid ${colors.grey[700]}`,
            borderRadius: "12px",
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: "all 0.2s ease-in-out",
            "&:hover": {
                borderColor: colors.blueAccent[400],
                boxShadow: `0px 4px 15px -5px ${colors.blueAccent[400]}`,
            },
        }}
    >
        <CardContent sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: colors.blueAccent[500], width: 56, height: 56 }}>
                    <NewspaperIcon />
                </Avatar>
                <Box>
                    <Typography variant="h5" component="div" fontWeight="bold">
                        {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        By {item.author}
                    </Typography>
                </Box>
            </Stack>
            <Divider sx={{ my: 2, borderColor: colors.grey[700] }} />
            <Typography variant="body1" sx={{ my: 2 }}>
                {item.content}
            </Typography>
        </CardContent>
        <CardActions sx={{ backgroundColor: colors.primary[700], p: 2, justifyContent: 'space-between' }}>
             <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayIcon fontSize="small" color="secondary" />
                <Typography variant="body2" color="text.secondary">{item.date}</Typography>
            </Stack>
            <IconButton onClick={() => onDelete(item.id)} color="error" size="small">
                <DeleteIcon />
            </IconButton>
        </CardActions>
    </Card>
);


// ====================================================================
// == المكون الرئيسي
// ====================================================================
const ProjectNewsTab = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { news, loading, error, refetchNews } = useProjectNews();

    // --- حالات لإضافة خبر جديد ---
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newNewsItem, setNewNewsItem] = useState({ title: '', content: '' });
    const [isSaving, setIsSaving] = useState(false);

    // --- حالات لتأكيد الحذف ---
    const [openConfirm, setOpenConfirm] = useState(false);
    const [newsIdToDelete, setNewsIdToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // --- دوال فتح وإغلاق نافذة الإضافة ---
    const handleOpenAddDialog = () => {
        setNewNewsItem({ title: '', content: '' }); // إعادة تعيين الحقول
        setIsAddDialogOpen(true);
    };
    const handleCloseAddDialog = () => setIsAddDialogOpen(false);

    const handleSaveNews = async () => {
        setIsSaving(true);
        try {
            // هنا تضع كود استدعاء الـ API لإضافة الخبر
            console.log("Saving news:", { ...newNewsItem, date: new Date().toISOString().split('T')[0], author: 'Current User' });
            // await axios.post(...);
            refetchNews();
        } catch (err) {
            console.error("Failed to save news:", err);
        } finally {
            setIsSaving(false);
            handleCloseAddDialog();
        }
    };

    // --- دوال فتح وإغلاق نافذة تأكيد الحذف ---
    const handleOpenConfirmDelete = (id) => {
        setNewsIdToDelete(id);
        setOpenConfirm(true);
    };
    const handleCloseConfirmDelete = () => {
        setOpenConfirm(false);
        setNewsIdToDelete(null);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            // هنا تضع كود استدعاء الـ API لحذف الخبر
            console.log("Deleting news with id:", newsIdToDelete);
            // await axios.delete(...);
            refetchNews();
        } catch (err) {
            console.error("Failed to delete news:", err);
        } finally {
            setIsDeleting(false);
            handleCloseConfirmDelete();
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ mt: 2 }}>Error, Please try again.</Alert>;

    return (
        <Box sx={{ width: '100%', mt: 2, p: 2 }}>
            
            {/* --- الهيدر وزر الإضافة --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Header title="Project News" subtitle="Latest updates and announcements about the project" />
                <Button
                    variant="contained"
                    
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddDialog}
                    sx={{backgroundColor:colors.greenAccent[600], height: '45px', px: 3 }}
                >
                    Add News
                </Button>
            </Box>
            
            {/* --- عرض الأخبار --- */}
            {!news || news.length === 0 ? (
                <Box sx={{ mt: 4, p: 4, textAlign: 'center', backgroundColor: colors.primary[700], borderRadius: '12px' }}>
                    <Typography variant="h6">There is no news to display.</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {news.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <NewsCard item={item} colors={colors} onDelete={handleOpenConfirmDelete} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* --- نافذة إضافة خبر جديد --- */}
            <Dialog open={isAddDialogOpen} onClose={handleCloseAddDialog} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>Add New Announcement</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        <TextField
                            autoFocus
                            required
                            label="News Title"
                            value={newNewsItem.title}
                            onChange={(e) => setNewNewsItem({ ...newNewsItem, title: e.target.value })}
                        />
                        <TextField
                            required
                            label="Content"
                            multiline
                            rows={4}
                            value={newNewsItem.content}
                            onChange={(e) => setNewNewsItem({ ...newNewsItem, content: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseAddDialog}>Cancel</Button>
                    <Button onClick={handleSaveNews} variant="contained" color="secondary" disabled={isSaving}>
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Publish'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- نافذة تأكيد الحذف --- */}
            <Dialog open={openConfirm} onClose={handleCloseConfirmDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this news item? This action is permanent.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseConfirmDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} variant="contained" color="error" disabled={isDeleting}>
                        {isDeleting ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default ProjectNewsTab;
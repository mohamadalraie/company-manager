// src/components/FileViewer.jsx

import React from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import FilePresentIcon from '@mui/icons-material/FilePresent'; // أيقونة عامة للملف
import DownloadIcon from '@mui/icons-material/Download';     // أيقونة التحميل
import VisibilityIcon from '@mui/icons-material/Visibility'; // أيقونة للعرض
import { tokens } from '../../../../theme'; // تأكد من المسار الصحيح لـ tokens

// بيانات وهمية للملفات
const mockFiles = [
  {
    id: 'file1',
    name: 'تقرير المشروع 2023.pdf',
    description: 'تقرير شامل عن سير عمل المشروع لعام 2023.',
    url: '../../../../assets/n.pdf', // تأكد من أن هذا المسار يؤدي إلى ملف PDF حقيقي في مجلد public
    type: 'pdf'
  },
  {
    id: 'file2',
    name: 'صورة المنتج.png',
    description: 'صورة عالية الجودة للمنتج الجديد.',
    url: '/assets/product_image.png', // مسار لملف صورة (مثلاً public/assets/product_image.png)
    type: 'png'
  },
  {
    id: 'file3',
    name: 'قائمة أسعار.xlsx',
    description: 'ملف Excel يحتوي على قائمة بأسعار المنتجات.',
    url: '/assets/prices.xlsx', // مسار لملف Excel (مثلاً public/assets/prices.xlsx)
    type: 'xlsx'
  },
  {
    id: 'file4',
    name: 'عرض تقديمي.pptx',
    description: 'عرض تقديمي لمراجعة الأداء.',
    url: '/assets/presentation.pptx', // مسار لملف PowerPoint
    type: 'pptx'
  },
  {
    id: 'file5',
    name: 'ملف مضغوط.zip',
    description: 'أصول المشروع الأساسية.',
    url: '/assets/project.zip', // مسار لملف مضغوط
    type: 'zip'
  },
];

const DocumentsTab = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('info');

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // دالة لفتح الملف في تبويبة جديدة (لأنواع الملفات التي يمكن للمتصفح عرضها مباشرة)
  const handleViewFile = (fileUrl, fileName) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = "_blank"; // لفتح الرابط في تبويبة جديدة
      link.rel = "noopener noreferrer"; // ممارسات أمنية جيدة

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar(`جاري فتح: ${fileName} في تبويبة جديدة`, "info");
    } catch (error) {
      console.error("فشل فتح الملف في تبويبة جديدة:", error);
      showSnackbar(`فشل فتح: ${fileName}`, "error");
    }
  };

  // دالة لإجبار تحميل الملف (لأنواع الملفات التي لا يمكن للمتصفح عرضها)
  const handleDownloadFile = (fileUrl, fileName) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName; // لإجبار المتصفح على تنزيل الملف
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar(`جاري تحميل: ${fileName}`, "success");
    } catch (error) {
      console.error("فشل تحميل الملف:", error);
      showSnackbar(`فشل تحميل: ${fileName}`, "error");
    }
  };

  return (
    <Box m="20px" p="20px" sx={{ backgroundColor: colors.primary[400], borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="h4" mb={3} sx={{ color: colors.grey[100], borderBottom: `1px solid ${colors.grey[700]}`, pb: 1 }}>
        مكتبة الملفات
      </Typography>

      {mockFiles.length === 0 ? (
        <Typography variant="body1" sx={{ color: colors.grey[300], textAlign: 'center', mt: 4 }}>
          لا توجد ملفات لعرضها حاليًا.
        </Typography>
      ) : (
        <List>
          {mockFiles.map((file, index) => (
            <React.Fragment key={file.id}>
              <ListItem
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  py: 2,
                  px: 0,
                }}
              >
                <ListItemIcon sx={{ minWidth: '40px', mb: { xs: 1, sm: 0 } }}>
                  <FilePresentIcon sx={{ color: colors.blueAccent[300], fontSize: '2rem' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ color: colors.grey[100] }}>
                      {file.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: colors.grey[300], mt: 0.5 }}>
                      {file.description || 'لا يوجد وصف لهذا الملف.'}
                    </Typography>
                  }
                  sx={{ flexGrow: 1, mr: { sm: 2 }, mb: { xs: 1, sm: 0 } }}
                />
                {/* الأزرار بناءً على نوع الملف */}
                {(file.type === 'pdf' || file.type === 'png' || file.type === 'jpg' || file.type === 'jpeg') ? (
                   <Box>
                   <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />} // أيقونة "رؤية"
                    onClick={() => handleViewFile(file.url, file.name)}
                    sx={{
                      backgroundColor: colors.blueAccent[600], // لون للعرض
                      color: colors.primary[100],
                      '&:hover': {
                        backgroundColor: colors.blueAccent[700],
                      },
                      minWidth: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    عرض
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />} // أيقونة "تحميل"
                    onClick={() => handleDownloadFile(file.url, file.name)}
                    sx={{
                      backgroundColor: colors.greenAccent[600], // لون للتحميل
                      color: colors.primary[100],
                      '&:hover': {
                        backgroundColor: colors.greenAccent[700],
                      },
                      minWidth: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    تحميل
                  </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />} // أيقونة "تحميل"
                    onClick={() => handleDownloadFile(file.url, file.name)}
                    sx={{
                      backgroundColor: colors.greenAccent[600], // لون للتحميل
                      color: colors.primary[100],
                      '&:hover': {
                        backgroundColor: colors.greenAccent[700],
                      },
                      minWidth: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    تحميل
                  </Button>
                )}
              </ListItem>
              {index < mockFiles.length - 1 && <Divider component="li" sx={{ borderColor: colors.grey[700] }} />}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Snackbar للرسائل */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
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

export default DocumentsTab;
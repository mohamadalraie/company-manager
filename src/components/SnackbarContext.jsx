import React, { createContext, useState, useContext } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// إنشاء مكون Alert المساعد
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// إنشاء الـ Context
const SnackbarContext = createContext();

// إنشاء custom hook لتسهيل استخدام الـ Context
export const useSnackbar = () => {
    return useContext(SnackbarContext);
};

// إنشاء المكون Provider الذي سيحتوي على منطق الـ Snackbar
export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // دالة لإظهار الـ Snackbar من أي مكان في التطبيق
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    // دالة لإغلاق الـ Snackbar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
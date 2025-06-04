// src/components/CustomSnackbar.jsx (تأكد من المسار الصحيح)

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert'; // أو Alert مباشرةً إذا كنت تستخدم إصدارات أحدث من MUI

// مكون Alert المساعد
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// استخدم forwardRef للسماح للمكون الأب بالوصول إلى دالة showSnackbar
const CustomSnackbar = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // 'success', 'error', 'info', 'warning'

  // دالة لفتح الـ Snackbar
  const showSnackbar = (msg, sev = 'success') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  // لجعل دالة showSnackbar متاحة للمكون الأب عبر ref
  useImperativeHandle(ref, () => ({
    showSnackbar,
  }));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000} // يمكن تمريرها كـ prop إذا أردت تخصيص المدة
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
});

export default CustomSnackbar;
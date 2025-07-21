import React, { useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from './firebase';

function App() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // طلب صلاحية الإشعارات
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, {
          vapidKey: 'BHLWyKpyT2Np1BR0mKnYbzBmHMDxSYmN_zHVrqGdyuIrnCM7TieG9WxFNWei8GtHhnSMRFksQJmBftn1zxHUog4'
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log('✅ Token:', currentToken);
            } else {
              console.warn('⚠️ لم يتم الحصول على توكين.');
            }
          })
          .catch((err) => {
            console.error('❌ خطأ أثناء جلب التوكين:', err);
          });
      } else {
        console.warn('❌ رفض المستخدم صلاحيات الإشعارات');
      }
    });

    // استقبال الإشعارات أثناء عمل الموقع (foreground)
    onMessage(messaging, (payload) => {
      console.log('📩 رسالة واردة أثناء الاستخدام:', payload);
      // خزّن الرسالة في الحالة
      if (payload.notification) {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body
        });
      }
    });
  }, []);

  return (
    <div>
      <h1>React + Firebase FCM</h1>
      {notification && (
        <div style={{
          background: '#e3f2fd',
          border: '1px solid #90caf9',
          borderRadius: '8px',
          padding: '16px',
          margin: '16px 0',
          color: '#1565c0'
        }}>
          <h2>{notification.title}</h2>
          <p>{notification.body}</p>
        </div>
      )}
    </div>
  );
}

export default App;

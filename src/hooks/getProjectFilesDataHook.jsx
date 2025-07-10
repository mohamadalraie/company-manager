// src/hooks/useProjectFilesData.js

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getProjectFilesApi, getOneParticipantApi } from "../shared/APIs"; // تأكد من استيراد API المشارك
import { getAuthToken } from "../shared/Permissions";

const useProjectFilesData = ({ projectId }) => {
  const [projectFiles, setProjectFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchFiles = useCallback(async () => {
    if (!projectId) {
      setProjectFiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      };

      // --- الخطوة 1: جلب قائمة الملفات الأساسية ---
      const filesResponse = await axios.get(`${baseUrl}${getProjectFilesApi(projectId)}`, config);
      const filesData = filesResponse.data.data;

      if (!filesData || filesData.length === 0) {
        setProjectFiles([]);
        setLoading(false);
        return;
      }
      
      // --- الخطوة 2: المرور على كل ملف واستدعاء الـ API الثانية ---
      // نستخدم Promise.all لجعل الطلبات متوازية وأكثر كفاءة
      const enhancedFilesPromises = filesData.map(async (file) => {
        let uploaderName = "Unknown User";

        // إذا كان للملف معرف مشارك، قم بجلب اسمه
        if (file.project_participant_id) {
          try {
            const participantResponse = await axios.get(`${baseUrl}${getOneParticipantApi(file.project_participant_id)}`, config);
            const participant = participantResponse.data.data;
            if (participant && participant.user) {
              uploaderName = `${participant.user.first_name} ${participant.user.last_name}`;
            }
          } catch (participantError) {
            console.error(`Failed to fetch name for participant ID ${file.project_participant_id}:`, participantError);
            // في حال فشل جلب الاسم، سيبقى الاسم هو "Unknown User"
          }
        }

        // --- الخطوة 3: إضافة الاسم كـ key و value إلى معلومات الملف ---
        return {
          ...file, // نسخ بيانات الملف الأصلية
          name: file.file_path.split('/').pop() || `File ${file.id}`,
          type: file.file_path.split('.').pop().toLowerCase(),
          uploader_name: uploaderName, // إضافة الحقل الجديد
        };
      });

      // انتظار انتهاء جميع عمليات جلب الأسماء
      const finalFormattedFiles = await Promise.all(enhancedFilesPromises);

      setProjectFiles(finalFormattedFiles);

    } catch (err) {
      console.error("Error fetching project files:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    refetchFiles();
  }, [refetchFiles]);

  return { projectFiles, loading, error, refetchFiles };
};

export default useProjectFilesData;
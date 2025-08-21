// src/hooks/useProjectMediaData.js

import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // تأكد من صحة المسار
import { getProjectMediaApi } from "../shared/APIs"; // تأكد من إضافة هذا المتغير في ملف APIs
import { getAuthToken } from "../shared/Permissions";

const useProjectMediaData = ({ projectId }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(0);

  const refetchMedia = () => {
    setRefetch((prev) => prev + 1);
  };

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchMedia = async () => {
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        };
        // سنقوم بتمرير ID المشروع إلى الـ API
        const response = await axios.get(
          `${baseUrl}${getProjectMediaApi}${projectId}`, // تعديل الرابط ليشمل ID المشروع
          config
        );
        
        // استخراج مسارات الملفات فقط كما طلبت
        const mediaData = response.data.data.map(item => ({
          id: item.id,
          url: item.path_file,
          type: item.path_file.match(/\.(jpeg|jpg|gif|png)$/) != null ? 'image' : 'video'
        }));

        setMedia(mediaData);
        setError(null);
      } catch (err) {
        console.error("Error fetching project media:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [projectId, refetch]); // يعتمد على projectId و refetch

  return { media, loading, error, refetchMedia };
};

export default useProjectMediaData;
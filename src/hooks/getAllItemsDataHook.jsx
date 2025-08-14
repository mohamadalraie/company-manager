// src/hooks/useItemsData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // تأكد من صحة المسار
import { getAllItemsApi } from "../shared/APIs"; // 👈 استيراد الـ API الجديد
import { getAuthToken } from "../shared/Permissions"; // تأكد من صحة المسار

const useMaterialsData = () => {
  // 🔽 تغيير أسماء المتغيرات لتناسب "items"
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      };
      // 🔽 استخدام API الخاص بالـ items
      const response = await axios.get(`${baseUrl}${getAllItemsApi}`, config);
      const materialsData = response.data.data;

      // ✅ لا حاجة لعمل map هنا لأن البيانات جاهزة للاستخدام مباشرة
      setMaterials(materialsData);

    } catch (err) {
      console.error("Error fetching items:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refetchMaterials();
  }, []); // يعمل مرة واحدة عند تحميل الواجهة


  return { materials, loading, error, refetchMaterials };
};

export default useMaterialsData;
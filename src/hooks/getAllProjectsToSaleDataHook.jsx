import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getAllProjectSalingDetailsApi } from "../shared/APIs";
import { getAuthToken } from "../shared/Permissions";

const useProjectSalesData = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
      const response = await axios.get(`${baseUrl}${getAllProjectSalingDetailsApi}`, config);
      const rawData = response.data.data || [];

      // --- تسطيح البيانات لتناسب الـ DataGrid ---
      const formattedData = rawData.map(sale => ({
        // دمج بيانات المشروع مع بيانات البيع
        ...sale.project, 
        ...sale,
        // إعادة تعريف الـ id ليكون هو id سجل البيع (الأهم)
        // والاحتفاظ بـ id المشروع الأصلي باسم آخر
        id: sale.id,
        projectId: sale.project.id, 
      }));
      
      setSales(formattedData);

    } catch (err) {
      console.error("Error fetching project sales data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchSales();
  }, [refetchSales]);

  return { sales, loading, error, refetchSales };
};

export default useProjectSalesData;
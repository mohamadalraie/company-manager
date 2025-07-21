import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getSingleProjectSaleApi } from "../shared/APIs"; // افترض وجود هذا
import { getAuthToken } from "../shared/Permissions";

const useSingleProjectSaleData = ({ saleId }) => {
  const [saleData, setSaleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(saleId);

  const refetchSaleData = useCallback(async () => {
    if (!saleId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
    
      const response = await axios.get(`${baseUrl}${getSingleProjectSaleApi}${saleId}`, config);
      setSaleData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [saleId]);

  useEffect(() => {
    refetchSaleData();
  }, [refetchSaleData]);

  return { saleData, loading, error, refetchSaleData };
};

export default useSingleProjectSaleData;
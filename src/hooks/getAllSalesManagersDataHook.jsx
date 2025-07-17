// src/hooks/useEngineersData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllSalesManagersApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";

const useSalesManagersData = () => {
  const [salesManagers, setSalesManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const refetchSalesManagers = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      };
      const response = await axios.get(`${baseUrl}${getAllSalesManagersApi}`,config);
      const data = response.data.data;

      const formattedSalesManagers = data.map((manager) => ({
        id: manager.id,
        first_name: manager.user.first_name,
        last_name: manager.user.last_name,
        email: manager.user.email,
        phone_number: manager.user.phone_number,
        status: manager.user.is_active,
      }));

      setSalesManagers(formattedSalesManagers);
    } catch (err) {
      console.error("Error fetching managers:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {

    refetchSalesManagers();
  }, []);

  return { salesManagers, loading, error,refetchSalesManagers };
};

export default useSalesManagersData;
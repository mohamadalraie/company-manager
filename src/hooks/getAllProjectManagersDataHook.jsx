// src/hooks/useEngineersData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import {  getAllProjectManagersApi } from "../shared/APIs"; // Adjust path as needed

const useProjectManagersData = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token=localStorage.getItem("authToken");

  const refetchManagers = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.get(`${baseUrl}${getAllProjectManagersApi}`,config);
      const mangersData = response.data.data;

      const formattedManagers = mangersData.map((manager) => ({
        id: manager.id,
        first_name: manager.user.first_name,
        last_name: manager.user.last_name,
        email: manager.user.email,
        phone_number: manager.user.phone_number,
        status: manager.user.status,
      }));

      setManagers(formattedManagers);
    } catch (err) {
      console.error("Error fetching managers:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {

    refetchManagers();
  }, []);

  return { managers, loading, error,refetchManagers };
};

export default useProjectManagersData;
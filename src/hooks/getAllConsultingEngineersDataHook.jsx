// src/hooks/useEngineersData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllConsultingEngineersApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";

const useConsultingEngineersData = () => {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        };
        const response = await axios.get(`${baseUrl}${getAllConsultingEngineersApi}1`,config);
        const engineersData = response.data.data;

        const formattedEngineers = engineersData.map((engineer) => ({
          id: engineer.id,
          first_name: engineer.user.first_name,
          last_name: engineer.user.last_name,
          email: engineer.user.email,
          phone_number: engineer.user.phone_number,
          status: engineer.user.status,
          specialization_name: engineer.specialization.name,
        }));

        setEngineers(formattedEngineers);
      } catch (err) {
        console.error("Error fetching engineers:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEngineers();
  }, []);

  return { engineers, loading, error };
};

export default useConsultingEngineersData;
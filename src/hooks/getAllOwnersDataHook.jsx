// src/hooks/useEngineersData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllOwnersApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";

const useOwnersData = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwners= async () => {
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        };
        const response = await axios.get(`${baseUrl}${getAllOwnersApi}`,config);
        const OwnersData = response.data.data;
        console.log(response);

        const formattedOwners = OwnersData.map((owner) => ({
          id: owner.id,
          first_name: owner.user.first_name,
          last_name: owner.user.last_name,
          email: owner.user.email,
          phone_number: owner.user.phone_number,
          status: owner.user.status,

        }));

        setOwners(formattedOwners);
      } catch (err) {
        console.error("Error fetching owners:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);
  

  return { owners, loading, error };
};

export default useOwnersData;
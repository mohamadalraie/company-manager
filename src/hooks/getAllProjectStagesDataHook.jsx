// src/hooks/useProjectStagesData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllProjectStagesApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";

const useProjectStagesData = (projectId) => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(0); // State to trigger refetch

  const refetchData = () => {
    setRefetch(prev => prev + 1); // Increment to trigger useEffect
  };
  
  useEffect(() => {
    // Don't fetch if there's no projectId
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchStages = async () => {
      setLoading(true); // Set loading to true at the start of a fetch
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        };

        const response = await axios.get(`${baseUrl}${getAllProjectStagesApi}${projectId}`, config);
        const stagesData = response.data.data;

        // Format the API data to match the structure your components expect
        const formattedStages = stagesData.map((stage, index) => ({
          id: stage.id,
          number: index + 1, // Generating number based on index
          title: stage.name,
          description: stage.description,
          startDate: stage.start_date,
          endDate: stage.expected_closed_date,
          priority: stage.priority,
          tasks: stage.tasks || [], // Ensure tasks is always an array
        }));

        setStages(formattedStages);
        setError(null); // Clear any previous errors on success
      } catch (err) {
        console.error("Error fetching project stages:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, [projectId, refetch]); // Re-run the effect if projectId or refetch changes

  return { stages, loading, error, refetchData };
};

export default useProjectStagesData;
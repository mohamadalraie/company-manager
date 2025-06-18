// src/hooks/useProjectsData.js

import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Assuming baseUrl is defined here
import { getOneProjectApi } from "../shared/APIs"; // Assuming getProjectsApi is defined here

/**
 * Custom React Hook to fetch project data from the API.
 *
 * @returns {Object} An object containing:
 * - projects: An array of project data.
 * - isLoading: A boolean indicating if data is currently being loaded.
 * - error: A string containing an error message if the fetch failed, otherwise null.
 */
const useOneProjectData = (id) => {
  const [project, setProject] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null); // Clear any previous errors

        const response = await axios.get(`${baseUrl}${getOneProjectApi}${id}`);

        // Check the API response structure to correctly access the projects array
        // Your provided structure has `data: { data: [...] }`
        if (response.data.data) {
          setProject(response.data.data);
        } else {
          // Warn if the data format is unexpected
          console.warn("API response for projects is not an array as expected:", response.data);
          setProject([]); // Ensure projects is an empty array to avoid errors
        }
      } catch (err) {
        console.error("Error fetching projects in useProjectsData hook:", err);
        setError("Failed to load projects. Please try again later.");
        // Note: The snackbar message will now be handled in the component that uses this hook.
      } finally {
        setIsLoading(false); // Always set loading to false after attempt
      }
    };

    fetchProject();
  }, [id]); // Empty dependency array means this hook runs once on component mount

  return { project, isLoading, error };
};

export default useOneProjectData;
// src/hooks/useProjectFilesData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
// Assuming you define your API endpoints in a central file
// e.g., in src/shared/APIs.js
// export const getProjectFilesApi = (projectId) => `/api/projectFiles/${projectId}/all`;
import { getProjectFilesApi } from "../shared/APIs"; 

const useProjectFilesData = ({projectId}) => {
  const [projectFiles, setProjectFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to refetch files (useful for updates or retries)
  const refetchFiles = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      if (!projectId) {
        
        // If projectId is not available, don't fetch and just set loading to false
        console.warn("Project ID is missing, cannot fetch project files.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${baseUrl}${getProjectFilesApi(projectId)}`);
      console.log(`${baseUrl}${getProjectFilesApi({projectId})}`);
      const filesData = response.data.data; // Access the 'data' array from your API response
      console.log(response);
      // Format the data if necessary, similar to engineersData
      // For project files, it seems your API already returns a good structure.
      // We'll just add a 'name' field for display if 'file_path' is a full URL.
      const formattedFiles = filesData.map((file) => ({
        id: file.id,
        file_path: file.file_path,
        description: file.description,
        project_id: file.project_id,
        project_participant_id: file.project_participant_id,
        // You might want a 'name' for display. If 'file_path' is a URL,
        // you can extract the filename from it.
        name: file.file_path.split('/').pop() || `File ${file.id}`,
        // Determine file type from extension for viewer/download logic
        type: file.file_path.split('.').pop().toLowerCase()
      }));

      setProjectFiles(formattedFiles);
    } catch (err) {
      console.error("Error fetching project files:", err);
      setError(err); // Store the error object
    } finally {
      setLoading(false);
    }
  };

  // useEffect to call fetchProjectFiles when the component mounts or projectId changes
  useEffect(() => {
    refetchFiles();
  }, [projectId]); // Re-run effect if projectId changes

  return { projectFiles, loading, error, refetchFiles };
};

export default useProjectFilesData;
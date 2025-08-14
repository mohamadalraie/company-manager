import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllProjectItemsApi, getprojectContainerReportsApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";
import { useProject } from '../contexts/ProjectContext';


const useProjectContainerReportsData = ({}) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedProjectId } = useProject();

  const refetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      };
      const response = await axios.get(`${baseUrl}${getprojectContainerReportsApi(selectedProjectId)}`, config);
      console.log(response.data)
      const itemsData = response.data.data;

      // Flatten the response data to make it easier to work with
      const materials = itemsData.map((item) => ({
        id:item.id,
        expected_quantity: item.expected_quantity,
        quantity_available: item.quantity_available,
        consumed_quantity: item.consumed_quantity,
        // Safely access nested properties from the "items_id" object
        name: item.item ? item.item.name : 'Not Available',
        category: item.item ? item.item.category : 'N/A',
        unit: item.item ? item.item.unit : "alll",
      }));

      setMaterials(materials);
    } catch (err) {
      console.error("Error fetching project items:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchMaterials();
  }, []);

  return { materials, loading, error, refetchMaterials };
};

export default useProjectContainerReportsData;
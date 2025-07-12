import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import {  getProjectInventoryApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";
import { useProject } from '../contexts/ProjectContext';

const useProjectInventoryData = ({}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedProjectId } = useProject();
  const refetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      };
      const response = await axios.get(`${baseUrl}${getProjectInventoryApi(selectedProjectId)}`, config);
      const itemsData = response.data.data;

      // Flatten the response data to make it easier to work with
      const materials = itemsData.map((item) => ({
        
        quantity_available: item.quantity_available,
        // Safely access nested properties from the "items_id" object
        name: item.item ? item.item.name : 'Not Available',
        category: item.item ? item.item.category : 'N/A',
        unit: item.item ? item.item.unit : "N/A",
        itemId: item.item ? item.item.id : null,
      }));

      setItems(materials);
    } catch (err) {
      console.error("Error fetching project items:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchItems();
  }, []);

  return { materials: items, loading, error, refetchMaterials: refetchItems };
};

export default useProjectInventoryData;
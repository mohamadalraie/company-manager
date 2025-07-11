import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllProjectItemsApi, getProjectInventoryApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";

const useProjectInventoryData = ({projectId}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      };
      const response = await axios.get(`${baseUrl}${getProjectInventoryApi(projectId)}`, config);
      const itemsData = response.data.data;

      // Flatten the response data to make it easier to work with
      const materials = itemsData.map((item) => ({
        id: item.id,
        expected_quantity: item.expected_quantity,
        // Safely access nested properties from the "items_id" object
        name: item.items_id ? item.items_id.name : 'Not Available',
        category: item.items_id ? item.items_id.category : 'N/A',
        unit: item.items_id ? item.items_id.unit : "alll",
        itemId: item.items_id ? item.items_id.id : null,
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
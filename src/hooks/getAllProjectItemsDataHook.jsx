import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllProjectItemsApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";

const useProjectItemsData = ({projectId}) => {
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
      const response = await axios.get(`${baseUrl}${getAllProjectItemsApi(projectId)}`, config);
      const itemsData = response.data.data;

      // Flatten the response data to make it easier to work with
      const formattedItems = itemsData.map((item) => ({
        id: item.id,
        "quantity-available": item["quantity-available"],
        "expected-quantity": item["expected-quantity"],
        "consumed-quantity": item["consumed-quantity"],
        "required-quantity": item["required-quantity"],
        "remaining-quantity": item["remaining-quantity"],
        
        // Safely access nested properties from the "items_id" object
        name: item.items_id ? item.items_id.name : 'Not Available',
        category: item.items_id ? item.items_id.category : 'N/A',
        price: item.items_id ? item.items_id.price : 0,
        itemId: item.items_id ? item.items_id.id : null,
      }));

      setItems(formattedItems);
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

  return { items, loading, error, refetchItems };
};

export default useProjectItemsData;
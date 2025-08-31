import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getAssignedTicketsApi} from "../shared/APIs";
import { baseUrl } from "../shared/baseUrl";
import { getAuthToken } from "../shared/Permissions";

// A hook to fetch tickets created by the current user
const useAssignedTicketsData = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const config = {
            headers: { Authorization: `Bearer ${getAuthToken()}` }
          };
         
          const response = await axios.get(`${baseUrl}${getAssignedTicketsApi}`, config);
              setTickets(response.data.data);
              console.log(response.data)
      

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, loading, error, refetch: fetchTickets };
};

export default useAssignedTicketsData;
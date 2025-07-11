import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getTaskResourcesApi } from "../shared/APIs"; // افترض وجود هذا المسار
import { getAuthToken } from "../shared/Permissions";

const useTaskResources = ({ taskId }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchResources = useCallback(async () => {
    if (!taskId) {
      setResources([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
      const response = await axios.get(`${baseUrl}${getTaskResourcesApi(taskId)}`, config);
      // افترض أن API يرجع البيانات مباشرة أو تحتاج لتسطيحها
      setResources(response.data.data || []);
    } catch (err) {
      console.error("Error fetching task resources:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    refetchResources();
  }, [refetchResources]);

  return { resources, loading, error, refetchResources };
};

export default useTaskResources;
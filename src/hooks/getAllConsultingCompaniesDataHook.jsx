// src/hooks/useEngineersData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllConsultingCompaniesApi } from "../shared/APIs"; // Adjust path as needed

const useConsultingCompaniesData = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token=localStorage.getItem("authToken");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        const response = await axios.get(`${baseUrl}${getAllConsultingCompaniesApi}`,config);
        const companiesData = response.data.data;

        const formattedCompanies = companiesData.map((company) => ({
          id: company.id,
          name: company.name,
          email: company.email,
          manager_name: `${company.focal_point_first_name} ${company.focal_point_last_name}`,
          address: company.address,
          phone_number: company.phone_number,
          land_line: company.land_line,
          license_number: company.license_number,
        }));

        setCompanies(formattedCompanies);
      } catch (err) {
        console.error("Error fetching the companies:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, loading, error };
};

export default useConsultingCompaniesData;
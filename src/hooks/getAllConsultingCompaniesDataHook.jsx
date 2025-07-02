// src/hooks/useConsultingCompaniesData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllConsultingCompaniesApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";

const useConsultingCompaniesData = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ✅ الخطوة 1: إضافة متغير الحالة ليكون "زناد" التحديث
  const [refetch, setRefetch] = useState(0);

  // ✅ الخطوة 2: إنشاء دالة بسيطة لتغيير قيمة "الزناد"
  const refetchCompanies = () => {
    setRefetch(prev => prev + 1);
  };
  
  // ✅ الخطوة 3: ربط useEffect بمتغير "الزناد"
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true); // إعادة التحميل عند كل استدعاء
      setError(null); // مسح أي أخطاء سابقة
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        };
        const response = await axios.get(`${baseUrl}${getAllConsultingCompaniesApi}`, config);
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
  }, [refetch]); // سيعمل هذا الكود في كل مرة تتغير فيها قيمة 'refetch'

  // ✅ الخطوة 4: إرجاع دالة "الزناد" مع بقية المتغيرات
  return { companies, loading, error, refetchCompanies };
};

export default useConsultingCompaniesData;
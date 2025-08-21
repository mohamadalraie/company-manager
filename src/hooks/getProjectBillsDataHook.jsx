import { useState, useEffect } from "react";
import axios from "axios";
import { useProject } from '../contexts/ProjectContext'; // تأكد من صحة المسار
import {  getProjectBillsApi } from "../shared/APIs"; // تأكد من صحة المسار
import { getAuthToken } from "../shared/Permissions"; // تأكد من صحة المسار
import { baseUrl } from "../shared/baseUrl";

const useProjectBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { selectedProjectId } = useProject();

    const fetchBills = async () => {
        if (!selectedProjectId) return;

        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            };
            const response = await axios.get(`${baseUrl}${getProjectBillsApi}${selectedProjectId}`, config);
            
            // معالجة البيانات وتجهيزها للعرض
            const billsData = response.data.data.map(bill => ({
                id: bill.id,
                description: bill.description,
                date: bill.date_of_payment,
                totalCost: parseFloat(bill.total_cost),
                details: bill.details.map(detail => ({
                    id: detail.id,
                    item: detail.item,
                    note: detail.note,
                    cost: parseFloat(detail.cost)
                }))
            }));

            setBills(billsData);

        } catch (err) {
            console.error("Error fetching project bills:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, [selectedProjectId]);

    return { bills, loading, error, refetchBills: fetchBills };
};

export default useProjectBills;
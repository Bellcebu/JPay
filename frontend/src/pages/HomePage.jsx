import React, { useEffect, useState } from "react";
import BalanceSection from "../sections/BalanceSection";
import ActivitySection from "../sections/ActivitySection";
import SidebarLayout from "../layouts/SidebarLayout";
import { api } from "../../api";

const HomePage = () => {
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [accountData, userData] = await Promise.all([
                    api.getAccount(),
                    api.getUser()
                ]);

                if (accountData) {
                    const fullAccountData = userData ? { ...accountData, usuario: userData } : accountData;
                    setAccount(fullAccountData);
                }
                
                const transactionsData = await api.getTransactions();
                setTransactions(transactionsData);
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <SidebarLayout>
            <div className="max-w-4xl mx-auto">
                <BalanceSection account={account} loading={loading} />
                <ActivitySection transactions={transactions} loading={loading} />
            </div>
        </SidebarLayout>
    )
};

export default HomePage;
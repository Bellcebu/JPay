import React, { useState, useEffect } from "react";
import SidebarLayout from "../layouts/SidebarLayout";
import { Copy, Check, ArrowLeft, Wallet } from "lucide-react";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";

const DepositPage = () => {
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedField, setCopiedField] = useState(null);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const data = await api.getAccount();
                setAccount(data);
            } catch (error) {
                console.error("Error fetching account:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAccount();
    }, []);

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <SidebarLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                <button 
                    onClick={() => navigate('/home')} 
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Volver al inicio</span>
                </button>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                            <Wallet size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Ingresar Dinero</h1>
                        <p className="text-gray-500 mt-2">
                            Transfiere a tu cuenta JPay usando estos datos
                        </p>
                    </div>

                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-20 bg-gray-100 rounded-xl"></div>
                            <div className="h-20 bg-gray-100 rounded-xl"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Alias Card */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center group hover:border-purple-200 transition-colors">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Alias</p>
                                    <p className="font-mono font-medium text-lg text-gray-900">{account?.alias}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(account?.alias, 'alias')}
                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                    title="Copiar Alias"
                                >
                                    {copiedField === 'alias' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                </button>
                            </div>

                            {/* CVU Card */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center group hover:border-purple-200 transition-colors">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">CVU</p>
                                    <p className="font-mono font-medium text-lg text-gray-900">{account?.cvu}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(account?.cvu, 'cvu')}
                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                                    title="Copiar CVU"
                                >
                                    {copiedField === 'cvu' ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
};

export default DepositPage;

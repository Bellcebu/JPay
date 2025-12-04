import React, { useState } from "react";
import SidebarLayout from "../layouts/SidebarLayout";
import { Search, User, ArrowRight, X, Check, ArrowLeft, DollarSign } from "lucide-react";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";

const TransferPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('search'); // search, amount, success
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResult, setSearchResult] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Amount step state
    const [amount, setAmount] = useState("");
    const [transferLoading, setTransferLoading] = useState(false);

    const dummyContacts = [
        { id: 1, name: "Juan Perez", alias: "juan.perez.mp", avatar: null },
        { id: 2, name: "Maria Garcia", alias: "maria.g.mp", avatar: null },
        { id: 3, name: "Carlos Lopez", alias: "carlos.l.mp", avatar: null },
    ];

    const handleSearch = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            let data = {};
            // Simple detection: if 22 digits, assume CVU/CBU, else Alias
            if (/^\d{22}$/.test(searchTerm)) {
                data = { cvu: searchTerm };
            } else {
                data = { alias: searchTerm };
            }

            const result = await api.lookupAccount(data);
            setSearchResult(result);
            setShowModal(true);
        } catch (err) {
            setError(err.message || "No se encontró la cuenta");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (step === 'search') {
            setSearchResult(null);
            setSearchTerm("");
        }
    };

    const handleConfirmRecipient = () => {
        setShowModal(false);
        setStep('amount');
        setError(null);
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setError(null);
        setTransferLoading(true);

        try {
            await api.createTransfer({
                cvu_destino: searchResult.cvu,
                monto: parseFloat(amount)
            });
            setStep('success');
        } catch (err) {
            setError(err.message || "Error al realizar la transferencia");
        } finally {
            setTransferLoading(false);
        }
    };

    const handleBack = () => {
        setStep('search');
        setAmount("");
        setError(null);
    };

    // Amount formatting logic
    const formatAmount = (value) => {
        // Remove all non-numeric characters
        const cleanValue = value.replace(/\D/g, '');
        
        if (!cleanValue) return '';
        
        // Convert to number and divide by 100 to handle decimals
        const numberValue = parseFloat(cleanValue) / 100;
        
        // Format with Argentina locale
        return new Intl.NumberFormat('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numberValue);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Only allow numbers, commas and dots
        if (/^[\d.,]*$/.test(value)) {
            // Store raw numeric value for calculation
            const rawValue = value.replace(/\D/g, '');
            const numericValue = rawValue ? parseFloat(rawValue) / 100 : 0;
            
            setAmount(numericValue);
        }
    };

    return (
        <SidebarLayout>
            <div className="max-w-2xl mx-auto space-y-8 relative">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Transferir Dinero</h1>
                    <p className="text-gray-500 mt-2">Envía dinero a tus contactos o busca por Alias/CVU</p>
                </div>

                {step === 'search' && (
                    <>
                        {/* Search Section */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Buscar cuenta
                                </label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Ingresa Alias o CVU"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || !searchTerm}
                                        className="px-4 md:px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="hidden md:inline">Continuar</span>
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                            </form>
                        </div>

                        {/* Quick Contacts */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contactos Rápidos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {dummyContacts.map((contact) => (
                                    <button
                                        key={contact.id}
                                        onClick={() => setSearchTerm(contact.alias)}
                                        className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-purple-100 hover:shadow-md transition-all group text-left"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{contact.name}</p>
                                            <p className="text-sm text-gray-500">{contact.alias}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {step === 'amount' && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                            <ArrowLeft size={20} />
                            <span>Volver</span>
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                                <User size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{searchResult?.propietario}</h3>
                            <p className="text-gray-500">{searchResult?.alias || searchResult?.cvu}</p>
                        </div>

                        <form onSubmit={handleTransfer} className="space-y-6 max-w-sm mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monto a transferir
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="0,00"
                                        className="w-full pl-10 pr-4 py-4 text-2xl font-bold text-center bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                        value={amount ? new Intl.NumberFormat('es-AR', { minimumFractionDigits: 2 }).format(amount) : ''}
                                        onChange={handleAmountChange}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={transferLoading || !amount || parseFloat(amount) <= 0}
                                className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {transferLoading ? (
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                ) : (
                                    <>
                                        Transferir
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {step === 'success' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <Check size={40} strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Transferencia Exitosa!</h2>
                        <p className="text-gray-500 mb-8">
                            Has enviado ${amount} a {searchResult?.propietario}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/home')}
                                className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Ir al Inicio
                            </button>
                            <button
                                onClick={() => {
                                    setStep('search');
                                    setAmount("");
                                    setSearchTerm("");
                                    setSearchResult(null);
                                }}
                                className="px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                            >
                                Nueva Transferencia
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirmation Modal (Only for Search Step) */}
            {showModal && searchResult && step === 'search' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center space-y-6">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600">
                                <User size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Confirmar Destinatario</h3>
                                <p className="text-gray-500 text-sm">¿Deseas transferir a esta persona?</p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-left">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Titular</p>
                                    <p className="font-medium text-gray-900">{searchResult.propietario}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Alias</p>
                                    <p className="font-medium text-gray-900">{searchResult.alias}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">CVU</p>
                                    <p className="font-semibold text-gray-900 font-mono text-sm">{searchResult.cvu}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirmRecipient}
                                    className="flex-1 px-4 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SidebarLayout>
    );
};

export default TransferPage;

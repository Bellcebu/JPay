import React from 'react';
import { X, Download, FileText, CheckCircle } from 'lucide-react';

const ReceiptModal = ({ isOpen, onClose, transaction }) => {
    if (!isOpen || !transaction) return null;

    const isDebit = transaction.tipo === 'debito';
    const isTransfer = transaction.descripcion?.toLowerCase().includes('transferencia');
    const amount = parseFloat(transaction.monto);

    const handleDownload = () => {
        if (transaction.comprobante) {
            // If it's a full URL, use it directly. If relative, prepend backend URL if needed.
            // Assuming backend serves media files correctly.
            const url = transaction.comprobante.startsWith('http') 
                ? transaction.comprobante 
                : `http://localhost:8000${transaction.comprobante}`;
            
            window.open(url, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <FileText size={20} className="text-purple-600" />
                        Detalle del Movimiento
                    </h3>
                    <button 
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDebit ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'}`}>
                        <CheckCircle size={32} />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {isDebit ? '-' : '+'} $ {amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </h2>
                    <p className="text-gray-500 font-medium mb-8">
                        {transaction.descripcion || (isTransfer ? 'Transferencia' : 'Movimiento')}
                    </p>

                    <div className="space-y-4 text-left bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Fecha</span>
                            <span className="text-sm font-medium text-gray-900">
                                {new Date(transaction.creado_en).toLocaleString('es-AR')}
                            </span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                            <span className="text-sm text-gray-500 shrink-0">Referencia</span>
                            <span className="text-sm font-bold text-gray-900 font-mono text-right">
                                {transaction.referencia || '-'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Tipo</span>
                            <span className="text-sm font-medium text-gray-900 capitalize">
                                {transaction.tipo === 'debito' ? 'Débito' : transaction.tipo === 'credito' ? 'Crédito' : transaction.tipo}
                            </span>
                        </div>
                    </div>

                    {transaction.comprobante && (
                        <button
                            onClick={handleDownload}
                            className="w-full mt-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                        >
                            <Download size={20} />
                            Descargar Comprobante
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;

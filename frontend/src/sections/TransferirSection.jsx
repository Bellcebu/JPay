import React, { useState } from "react";
import TransferirButton from "../components/TransferirButton";
import { ChevronDown } from "lucide-react";
const conceptos = [
    { value: "varios", label: "Varios" },
    { value: "alquileres", label: "Alquileres" },
    { value: "capital", label: "Aportes de Capital" },
    { value: "bienes_hab", label: "Bienes registrables habitualistas" },
    { value: "bienes_no_hab", label: "Bienes registrables no habitualistas" },
    { value: "cuotas", label: "Cuotas" },
    { value: "expensas", label: "Expensas" },
    { value: "facturas", label: "Facturas" },
    { value: "haberes", label: "Haberes" },
    { value: "honorarios", label: "Honorarios" },
    { value: "inmobiliarias", label: "Operaciones inmobiliarias" },
    { value: "inmobiliarias_hab", label: "Operaciones inmobiliarias habitualistas" },
    { value: "prestamos", label: "Préstamos" },
    { value: "seguros", label: "Seguros" },
    { value: "suscripcion", label: "Suscripción obligaciones negociables" }
];
const getInitialConcepto = () => conceptos.find(c => c.value === 'varios');

export default function TransferirSection() {

    // --- ESTADOS PARA CADA CAMPO ---
    const [destinatario, setDestinatario] = useState('');
    const [monto, setMonto] = useState('');
    const [conceptoSeleccionado, setConceptoSeleccionado] = useState(getInitialConcepto().value); // Usaremos el value
    
    // Estado del Dropdown
    const [openConceptos, setOpenConceptos] = useState(false);

    
    const conceptoActualLabel = conceptos.find(c => c.value === conceptoSeleccionado)?.label;


    // restablecer el formulario
    const handleCancel = () => {
        setDestinatario('');
        setMonto('');
        setConceptoSeleccionado('varios'); 
        setOpenConceptos(false);
        console.log('Formulario de transferencia cancelado y limpiado.');
    };

    // Lógica para seleccionar concepto del dropdown
    const handleSelectConcepto = (value) => {
        setConceptoSeleccionado(value);
        setOpenConceptos(false);
    };

    // Lógica para manejar el envío del formulario (ejemplo)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos a enviar:', { destinatario, monto, concepto: conceptoSeleccionado });
        // Aquí iría la llamada a la API
    };



    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Transferir Dinero
            </h1>
            <div className="bg-white p-4 md:p-8 p-8 rounded-2xl shadow-xl min-h-[300px] max-w-lg mx-auto"> 
                <div className="max-w-sm mx-auto">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* DESTINATARIO */}
                        <div>
                            <label 
                                htmlFor="destinatario"
                                className="block text-sm font-medium text-black-700 mb-1"
                            >
                                Alias/CBU/CVU del Destinatario
                            </label>
                            <input 
                                type="text" 
                                id="destinatario"
                                name="destinatario"
                                placeholder="Ingresá CBU o Alias"
                                value={destinatario}
                                onChange={(e) => setDestinatario(e.target.value)} // <-- HANDLER
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                            />
                        </div>
                        {/*MONTO*/}
                        <div>
                            <label 
                                htmlFor="monto"
                                className="block text-sm font-medium text-black-700 mb-1"
                            >
                                Monto a transferir
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-500 font-semibold">$ </span>
                                <input 
                                    type="number" 
                                    id="monto"
                                    name="monto"
                                    placeholder="Ingresá el monto"
                                    value={monto} // <-- ENLAZADO
                                    onChange={(e) => setMonto(e.target.value)} // <-- HANDLER
                                    min="0.01"
                                    step="0.01"
                                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>
                        {/* CONCEPTO — dropdown custom */}
                        <div className="relative">
                            <label className="block text-sm font-medium text-black-700 mb-1">
                                Concepto
                            </label>

                            {/* Botón */}
                            <button
                                type="button"
                                onClick={() => setOpenConceptos(o => !o)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                                        bg-white flex justify-between items-center
                                        focus:ring-purple-500 focus:border-purple-500"
                            >
                                <span>{conceptoActualLabel}</span>
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Dropdown */}
                            {openConceptos && (
                                <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                                    {conceptos.map((c) => (
                                        <li
                                            key={c.value}
                                            onClick={() => {
                                                handleSelectConcepto(c.value); // Usa el handler
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {c.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>


                        <div className="flex flex-col space-y-3 mt-8 max-w-xs mx-auto">
                            <TransferirButton
                                type="submit"
                                className="w-full"
                            >
                                Continuar
                            </TransferirButton>

                            <TransferirButton
                                type="button"
                                variant="secondary"
                                className="w-full"
                                onClick={handleCancel} // <-- ¡AQUÍ ESTÁ LA NUEVA FUNCIÓN!
                            >
                                Cancelar
                            </TransferirButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
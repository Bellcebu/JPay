import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import React, { useState } from 'react';
export default function SolicitudPrestamosSection() {

    const [monto, setMonto] = useState('');
    const [plazo, setPlazo] = useState('');
    const [documentoSubido, setDocumentoSubido] = useState(false);
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [autorizaScore, setAutorizaScore] = useState(false);

    const montoNumero = Number(monto);

    const [mensaje, setMensaje] = useState('');

    const puedeSolicitar =
        monto !== '' &&
        !Number.isNaN(montoNumero) &&
        montoNumero >= 1000 &&
        montoNumero <= 50000 &&
        plazo !== '' &&
        documentoSubido &&
        aceptaTerminos &&
        autorizaScore;

    return (
        <section className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10">
        <header className="mb-6 text-center">
            <h2 className="text-3xl font-semibold text-black mb-1">Solicitud de Préstamos</h2>
            <p className="text-sm text-gray-500">Gestiona tus solicitudes de préstamos</p>
        </header>
            <div className="flex gap-4">
                <div className='flex-1'>
                    <p className="text-black-700 text-lg mb-1">
                        Elegí el monto
                    </p>
                    <input 
                        type="number"
                        min="1000"
                        max="50000"
                        step="500"
                        placeholder='Ingresá un monto'
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                    />  

                </div>
                <div className='flex-1'>  
                    <p className="text-black-700 text-lg mb-1">
                        Selecciona el plazo de devolución
                    </p>
                    <select 
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        value={plazo}
                        onChange={(e) => setPlazo(e.target.value)}
                    >
                        <option value="" disabled>Selecciona un plazo</option>
                        <option value="1">1 mes</option>
                        <option value="2">2 meses</option>
                        <option value="3">3 meses</option>
                        <option value="6">6 meses</option>
                        <option value="12">12 meses</option>
                        <option value="24">24 meses</option>
                    </select>
                </div>
            </div>
            
            <section className="my-6 border-t border-gray-200 ">
                <h1 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Resumen de tus datos personales</h1>

                <div className='space-y-2 ml-4 mt-6 max-w-xl mx-auto'>
                    <div className="flex items-center gap-2">
                        <span className="w-40 text-sm text-gray-700 text-md">
                            Nombre completo:
                        </span>
                        <span className="flex-1 px-5 py-3 bg-gray-100 rounded">
                            {User.nombre} {User.apellido}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-40 text-sm text-gray-700 text-md">
                            DNI:
                        </span>
                        <span className="flex-1 px-5 py-3 bg-gray-100 rounded">
                            {User.dni}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-40 text-sm text-gray-700 text-md">
                            CBU:
                        </span>
                        <span className="flex-5 px-5 py-3 bg-gray-100 rounded">
                            {User.cbu}
                        </span>
                    </div>
                    
                </div>
                
                
            </section>

            <section className="my-6 border-t border-gray-200 ">
                <h1 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Ingresá la documentación necesaria</h1>
                <div className='space-y-4 ml-4 mt-6 max-w-xl mx-auto'>
                    <div>
                        <label className="block text-sm text-gray-700 mb-1">
                            Recibo de sueldo o comprobante de ingresos
                        </label>
                        
                        <FileUpload onFilesSelected={(files => setDocumentoSubido(files && files.length>0))}/>
                    </div>
                </div>
            </section>

            <section className="my-6 border-t border-gray-200 ">
                <h1 className="text-2xl font-semibold text-gray-800 mt-4 mb-2">Términos y condiciones</h1>
                <div className='flex gap-4'>
                    <div className='space-y-4 ml-4 mt-6 max-w-xl mx-auto'>
                        <div className="flex items-start gap-2">
                            <input 
                                type="checkbox" 
                                className="mt-1"
                                checked={aceptaTerminos}
                                onChange={(e) => setAceptaTerminos(e.target.checked)}
                            />
                            <span className="text-sm text-gray-700">
                                Acepto los términos y condiciones del préstamo.
                            </span>
                        </div>
                    </div>
                    <div className='space-y-4 ml-4 mt-6 max-w-xl mx-auto'>
                        <div className="flex items-start gap-2">
                            <input 
                                type="checkbox" 
                                className="mt-1"
                                checked={autorizaScore}
                                onChange={(e) => setAutorizaScore(e.target.checked)} 
                            />
                            <span className="text-sm text-gray-700">
                                Autorizo la consulta de score crediticio.
                            </span>
                        </div>
                    </div>
                </div>
                
            </section>


            {/*<div>
                <p className="text-gray-700 text-lg">
                    Tasa de interés: 15% anual
                </p>
            </div>*/}

            {/* Botón de solicitud */}            
            <button 
                className="bg-purple-600 text-white py-2 px-6 rounded-full text-lg font-medium hover:bg-purple-700 transition-colors mt-4  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                disabled={!puedeSolicitar}
                onClick={() => {
                    if (!puedeSolicitar) return;
                    setMensaje('Tu solicitud de préstamo ha sido enviada con éxito.');
                }}>
                Solicitar Préstamo
            </button>

            {mensaje && (
        <p className="mt-2 text-sm text-green-600">
          {mensaje}
        </p>
      )}
            
        </section>
  );
}
import { useState } from 'react';
import TransferCardOrigin from '../components/TransferOriginCard';
import TransferDestinationCard from '../components/TransferDestinationCard';


const TransferSection = () => {
  // Estado para la cuenta origen seleccionada
  const [cuentaOrigen, setCuentaOrigen] = useState({
    id: 1,
    owner: 'Juan Pérez',
    balance: 15000
  });

  // Lista de cuentas disponibles para cambiar origen
  const cuentasDisponibles = [
    { id: 1, owner: 'Juan Pérez', balance: 15000 },
    { id: 2, owner: 'María Gómez', balance: 8500 },
    { id: 3, owner: 'Carlos López', balance: 25000 }
  ];

  // Estado para inputs del formulario
  const [destinatario, setDestinatario] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleCambiarCuenta = () => {
    // Simula cambio de cuenta (puedes hacer modal después)
    const nuevaCuenta = cuentasDisponibles.find(c => c.id !== cuentaOrigen.id) || cuentasDisponibles[0];
    setCuentaOrigen(nuevaCuenta);
  };

  const handleEnviarTransferencia = () => {
    if (!destinatario || !monto || monto > cuentaOrigen.balance) {
      alert('Completa todos los campos y verifica el saldo disponible');
      return;
    }
    alert(`Transferencia enviada: $${monto} a ${destinatario}`);
    // Reset formulario
    setDestinatario('');
    setMonto('');
    setDescripcion('');
  };

  return (
    <div className="w-full min-h-screen overflow-y-auto p-6">
      <section className="bg-white rounded-2xl p-8 space-y-7 max-w-4xl mx-auto shadow-xl">
        
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Transferencia</h1>
          <p className="text-gray-600">Selecciona origen, destino y monto para enviar dinero</p>
        </div>

        {/* Cuenta de origen */}
        <TransferCardOrigin 
          Owner={cuentaOrigen.owner} 
          Balance={cuentaOrigen.balance}
          onChangeCuenta={handleCambiarCuenta}
        />

        {/* Destino de la transferencia */}
        <TransferDestinationCard 
          destinatario={destinatario}
          setDestinatario={setDestinatario}
        />

        
      </section>
    </div>
  );
};

export default TransferSection;

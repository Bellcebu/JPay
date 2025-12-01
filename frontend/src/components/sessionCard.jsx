import React from 'react';
//estructura de la tarjeta de sesiones activas, con unformacion: dispositivo, ubicacion, fecha y hora de ultima actividad
export default function SessionCard({ device, lastActive, location, daysActive }) {

    return (
        <div className="bg-white shadow-md rounded-lg p-2 mb-3">
            <h3 className="text-lg font-semibold mb-2">Dispositivo:{device}</h3>
            <p className="text-gray-600 mb-4">Última actividad: {lastActive}</p>
            <p className="text-gray-600 mb-4">ubicacion: {location}</p>
            <p className="text-gray-600 mb-4">Iniciado hace: {daysActive}</p>
        </div>
    );


}
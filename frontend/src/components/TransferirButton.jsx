import React from 'react';

export default function TransferirButton({ children, onClick, variant = 'primary' }) {
    
    // Define las clases para cada variante
    const baseClasses = "font-semibold py-1 rounded-lg transition duration-150 ease-in-out";
    
    const variantClasses = {
        // Variante por defecto (la morada actual)
        primary: "bg-purple-600 text-white hover:bg-purple-700", 
        
        // Nueva Variante para Cancelar (gris)
        secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300", 
    };

    // Combina las clases base con las clases específicas de la variante
    const finalClasses = `${baseClasses} ${variantClasses[variant]}`;

    return (
        <button 
            type="button" // Cambia a 'submit' si es necesario
            onClick={onClick} 
            className={finalClasses}
        >
            {children}
        </button>
    );
}
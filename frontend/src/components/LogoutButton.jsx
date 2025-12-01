import React from 'react';

export default function LogoutButton({ onClick, children, className }) {
    return(
    <div>
        <button
            onClick={onClick}
            className={`w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full ${className}`}
            >
            {children} 
        </button>
    </div>
);
}
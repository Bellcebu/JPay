
import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react"; // si no lo tenés: npm install lucide-react

export default function ElegantFileUpload({ onFilesSelected }) {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    if (onFilesSelected) onFilesSelected(selected);
  };

  return (
    <div className="w-full max-w-xl">
      {/* tarjeta elegante */}
      <div className="border border-gray-200 rounded-2xl bg-white px-6 py-8 shadow-sm flex flex-col items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
          <UploadCloud className="w-6 h-6 text-purple-600" />
        </div>

        <p className="text-sm text-gray-700 text-center">
          Adjuntá tu documentación en formato digital.
        </p>

        <button
          type="button"
          onClick={handleClick}
          className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-full bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition"
        >
          Seleccionar archivos
        </button>

        <p className="text-xs text-gray-400 mt-1">
          Tamaño máximo: 5GB · Formatos sugeridos: PDF, JPG, PNG
        </p>

        {/* input real (oculto) */}
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* listado de archivos seleccionados */}
      {files.length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-gray-600">
            Archivos seleccionados:
          </p>
          <ul className="text-xs text-gray-700 space-y-0.5">
            {files.map((file) => (
              <li key={file.name}>
                • {file.name}{" "}
                <span className="text-gray-400">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

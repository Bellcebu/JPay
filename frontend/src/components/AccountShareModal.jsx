import React from 'react';
import { X, Copy, Check } from 'lucide-react';

export default function AccountShareModal({ isOpen, onClose, account }) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !account) return null;

  const fullName = account.usuario ? `${account.usuario.first_name} ${account.usuario.last_name}` : '';
  const cbu = account.cvu || '';
  const alias = account.alias || '';

  const shareText = `
Hola! Te comparto mis datos de cuenta JPay:

Nombre: ${fullName}
CBU: ${cbu}
Alias: ${alias}

Enviame dinero de forma rápida y segura!
`.trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Compartir datos de cuenta</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Titular</p>
              <p className="text-lg font-medium text-gray-900">{fullName}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">CBU</p>
              <p className="text-lg font-medium text-gray-900 font-mono">{cbu}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Alias</p>
              <p className="text-lg font-medium text-purple-600 font-mono">{alias}</p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              copied 
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/30'
            }`}
          >
            {copied ? (
              <>
                <Check size={20} />
                <span>Copiado al portapapeles</span>
              </>
            ) : (
              <>
                <Copy size={20} />
                <span>Copiar datos</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

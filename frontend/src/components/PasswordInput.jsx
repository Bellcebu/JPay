import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = (props) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        placeholder="••••••••"
        className={`w-full px-3 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 ${props.className || ''}`}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;

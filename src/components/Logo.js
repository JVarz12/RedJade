import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Diamante */}
        <path 
          d="M20 5L25 15L20 35L15 15L20 5Z" 
          fill="#E53935" 
          stroke="#B71C1C" 
          strokeWidth="1.5"
        />
        <path 
          d="M20 5L25 15H15L20 5Z" 
          fill="#FF5252"
        />
        <path 
          d="M20 35L25 15L15 15L20 35Z" 
          fill="#B71C1C"
        />
      </svg>
      
      <div className="flex items-center">
        <span className="text-3xl font-bold text-red-600">RedJade</span>
      </div>
    </div>
  );
};

export default Logo;
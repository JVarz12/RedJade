import React, { useState } from 'react';
import { getEmployeeData, saveEmployeeData } from '../utils/storage';

const EmployeeLogin = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    const employeeData = getEmployeeData();
    const employee = employeeData.find(emp => emp.id === id);
    
    if (employee) {
      setError('');
      onLogin(employee);
    } else {
      setError('Cédula no registrada');
      setShowRegister(true);
    }
  };

  const handleRegister = () => {
    if (!id || !name) {
      setError('Cédula y nombre son requeridos');
      return;
    }

    const employeeData = getEmployeeData();
    
    if (employeeData.some(emp => emp.id === id)) {
      setError('Esta cédula ya está registrada');
      return;
    }

    const newEmployee = {
      id,
      name,
      hourlyRate: 6000,
      records: []
    };

    saveEmployeeData([...employeeData, newEmployee]);
    setError('');
    setShowRegister(false);
    onLogin(newEmployee);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingreso de Trabajador</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Cédula:</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingrese su cédula"
        />
      </div>

      {showRegister && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nombre Completo:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingrese su nombre"
          />
        </div>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showRegister ? (
        <div className="space-y-3">
          <button
            onClick={handleRegister}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Registrar y Entrar
          </button>
          <button
            onClick={() => setShowRegister(false)}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ingresar
        </button>
      )}
    </div>
  );
};

export default EmployeeLogin;
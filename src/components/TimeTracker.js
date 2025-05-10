import React, { useState, useEffect } from 'react';
import { getEmployeeData, saveEmployeeData } from '../utils/storage';

const TimeTracker = ({ employee, onLogout }) => {
  const [currentStatus, setCurrentStatus] = useState('entrada');
  const [todayRecords, setTodayRecords] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const employeeData = getEmployeeData();
    const currentEmployee = employeeData.find(emp => emp.id === employee.id);
    
    if (currentEmployee) {
      const todayRecords = currentEmployee.records.filter(
        record => record.date.split('T')[0] === today
      );
      setTodayRecords(todayRecords);
      
      if (todayRecords.length > 0) {
        const lastRecord = todayRecords[todayRecords.length - 1];
        setCurrentStatus(
          lastRecord.type === 'entrada' ? 'descanso' : 
          lastRecord.type === 'descanso' ? 'regreso' : 
          lastRecord.type === 'regreso' ? 'salida' : 'entrada'
        );
      }
    }
  }, [employee.id]);

  const handleAction = (type) => {
    const now = new Date();
    const employeeData = getEmployeeData();
    const updatedEmployees = employeeData.map(emp => {
      if (emp.id === employee.id) {
        return {
          ...emp,
          records: [
            ...emp.records,
            {
              type,
              date: now.toISOString(),
              timestamp: now.getTime()
            }
          ]
        };
      }
      return emp;
    });
    
    saveEmployeeData(updatedEmployees);
    setCurrentStatus(
      type === 'entrada' ? 'descanso' : 
      type === 'descanso' ? 'regreso' : 
      type === 'regreso' ? 'salida' : 'entrada'
    );
    setTodayRecords([...todayRecords, { type, date: now.toISOString() }]);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Bienvenido, {employee.name}</h2>
          <p className="text-sm text-gray-500">Cédula: {employee.id}</p>
        </div>
        <button 
          onClick={onLogout}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Cerrar sesión
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Registro de hoy:</h3>
        {todayRecords.length === 0 ? (
          <p className="text-gray-500">No hay registros hoy</p>
        ) : (
          <ul className="space-y-2">
            {todayRecords.map((record, index) => (
              <li key={index} className="flex justify-between">
                <span className="capitalize">{record.type}:</span>
                <span>{new Date(record.date).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3">
        {currentStatus === 'entrada' && (
          <button
            onClick={() => handleAction('entrada')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium"
          >
            Registrar Entrada
          </button>
        )}

        {currentStatus === 'descanso' && (
          <button
            onClick={() => handleAction('descanso')}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg font-medium"
          >
            Iniciar Descanso
          </button>
        )}

        {currentStatus === 'regreso' && (
          <button
            onClick={() => handleAction('regreso')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
          >
            Regresar de Descanso
          </button>
        )}

        {(currentStatus === 'salida' || currentStatus === 'descanso') && (
          <button
            onClick={() => handleAction('salida')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium"
          >
            Registrar Salida
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;


// DONE
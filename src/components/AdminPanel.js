import React from 'react';
import { getCurrentMonthRecords } from '../utils/storage';

const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const AdminPanel = ({ onBack }) => {
  const monthlyData = getCurrentMonthRecords();
  
  const calculateHours = (records) => {
    let totalHours = 0;
    let currentEntry = null;
    let breakTime = 0;
    
    records.forEach(record => {
      if (record.type === 'entrada' || record.type === 'regreso') {
        currentEntry = new Date(record.timestamp);
      } else if (currentEntry && record.type === 'descanso') {
        const breakStart = new Date(record.timestamp);
        breakTime += (breakStart - currentEntry) / (1000 * 60 * 60);
        currentEntry = null;
      } else if (currentEntry && record.type === 'salida') {
        const exitTime = new Date(record.timestamp);
        const hoursWorked = (exitTime - currentEntry) / (1000 * 60 * 60);
        totalHours += hoursWorked;
        currentEntry = null;
      }
    });
    
    return {
      totalHours: totalHours.toFixed(2),
      breakTime: breakTime.toFixed(2),
      payment: (totalHours * 6000).toFixed(2)
    };
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Panel Supervisor</h2>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Volver
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cédula</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Días Trabajados</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas Totales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiempo Descanso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {monthlyData.map((employee, index) => {
              const { totalHours, breakTime, payment } = calculateHours(employee.monthlyRecords);
              const workedDays = [...new Set(
                employee.monthlyRecords
                  .filter(record => ['entrada', 'salida'].includes(record.type))
                  .map(record => record.date.split('T')[0])
              )];
              
              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {workedDays.map((day, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {getDayName(day)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{totalHours} hrs</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{breakTime} hrs</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">${payment}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
import React from 'react';
import { getCurrentMonthRecords } from '../utils/storage';

const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const EmployeeReport = ({ employee }) => {
  const monthlyData = getCurrentMonthRecords().find(emp => emp.id === employee.id);
  
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
      payment: (totalHours * employee.hourlyRate).toFixed(2)
    };
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  };

  const { totalHours, breakTime, payment } = monthlyData ? calculateHours(monthlyData.monthlyRecords) : { totalHours: 0, breakTime: 0, payment: 0 };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Reporte Mensual</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Trabajador:</h3>
          <p>{employee.name} - {employee.id}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Días trabajados:</h3>
          {monthlyData && monthlyData.monthlyRecords.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {[...new Set(
                monthlyData.monthlyRecords
                  .filter(record => ['entrada', 'salida'].includes(record.type))
                  .map(record => record.date.split('T')[0])
              )].map((day, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                  {getDayName(day)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay registros este mes</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Horas trabajadas:</h3>
          <p>{totalHours} horas</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Tiempo de descanso:</h3>
          <p>{breakTime} horas</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Total a pagar:</h3>
          <p className="text-xl font-bold">${payment}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReport;


// DONE
import React, { useState } from 'react';
import EmployeeLogin from './components/EmployeeLogin';
import TimeTracker from './components/TimeTracker';
import EmployeeReport from './components/EmployeeReport';
import AdminPanel from './components/AdminPanel';
import Logo from './components/Logo';
import { saveEmployeeData } from './utils/storage';

const App = () => {
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeEmployees, setActiveEmployees] = useState([]);

  if (!localStorage.getItem('employees')) {
    saveEmployeeData([]);
  }

  const handleLogin = (employee) => {
    setCurrentEmployee(employee);
    setShowReport(false);
    setShowLogin(false);
    if (!activeEmployees.some(e => e.id === employee.id)) {
      setActiveEmployees([...activeEmployees, employee]);
    }
  };

  const handleLogout = (employeeId) => {
    setActiveEmployees(activeEmployees.filter(e => e.id !== employeeId));
    if (currentEmployee && currentEmployee.id === employeeId) {
      setCurrentEmployee(null);
      setShowLogin(true);
    }
  };

  const handleAdminLogout = () => {
    setShowAdmin(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <p className="text-gray-600 mt-2">Sistema de Control de Asistencia</p>
        </header>

        {showAdmin ? (
          <AdminPanel onBack={handleAdminLogout} />
        ) : showLogin || !currentEmployee ? (
          <EmployeeLogin onLogin={handleLogin} />
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowReport(false)}
                className={`px-4 py-2 rounded-lg ${!showReport ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
              >
                Registrar Tiempo
              </button>
              <button
                onClick={() => setShowReport(true)}
                className={`px-4 py-2 rounded-lg ${showReport ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
              >
                Ver Reporte
              </button>
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cambiar Usuario
              </button>
            </div>

            {showReport ? (
              <EmployeeReport employee={currentEmployee} />
            ) : (
              <TimeTracker 
                employee={currentEmployee} 
                onLogout={() => handleLogout(currentEmployee.id)} 
              />
            )}
          </div>
        )}

        {activeEmployees.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">Empleados Activos:</h3>
            <div className="flex flex-wrap gap-2">
              {activeEmployees.map(emp => (
                <span 
                  key={emp.id} 
                  className={`px-3 py-1 rounded-full text-sm ${emp.id === currentEmployee?.id ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {emp.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {!showAdmin && (
        <button
          onClick={() => setShowAdmin(true)}
          className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;


// DONE
export const getEmployeeData = () => {
  return JSON.parse(localStorage.getItem('employees')) || [];
};

export const saveEmployeeData = (data) => {
  localStorage.setItem('employees', JSON.stringify(data));
};

export const getCurrentMonthRecords = () => {
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  
  const employees = getEmployeeData();
  
  return employees.map(employee => {
    const monthlyRecords = employee.records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === month && recordDate.getFullYear() === year;
    });
    
    return {
      ...employee,
      monthlyRecords
    };
  });
};

export const getActiveEmployees = () => {
  const today = new Date().toISOString().split('T')[0];
  const employees = getEmployeeData();
  
  return employees.filter(employee => {
    return employee.records.some(
      record => record.date.split('T')[0] === today && 
      (record.type === 'entrada' || record.type === 'regreso')
    );
  });
};
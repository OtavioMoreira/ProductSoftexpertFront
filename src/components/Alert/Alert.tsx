import React from 'react';

const Alert = ({ type, message }) => {
  let alertClass = '';

  // Define a classe com base no tipo de alerta
  switch (type) {
    case 'success':
      alertClass = 'bg-green-500';
      break;
    case 'error':
      alertClass = 'bg-red';
      break;
    case 'warning':
      alertClass = 'bg-yellow-600';
      break;
    default:
      alertClass = 'bg-blue-500';
  }

  return (
    <div className={`py-2 px-4 rounded-md text-white ${alertClass}`}>
      {message}
    </div>
  );
};

export default Alert;

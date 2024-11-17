import React, { createContext, useContext, useState } from 'react';
import ToastComponent from './ToastMessage';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('info');

  const toastMessage = (msg, type = 'info', title = 'Info') => {
    setMessage(msg);
    setType(type);
    setTitle(title);
    setShow(true);

    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  const contextValue = {
    toastMessage,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastComponent
        show={show}
        message={message}
        onClose={() => setShow(false)}
        title={title}
        type={type}
      />
    </ToastContext.Provider>
  );
};

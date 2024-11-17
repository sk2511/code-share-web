import React from 'react';
import styled, { keyframes } from 'styled-components';
import { BsCheckCircle, BsExclamationTriangle, BsXCircle, BsInfoCircle } from 'react-icons/bs';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%);
  }
`;

const StyledToast = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1050;
  width: 350px;
  background-color: #f8f9fa;
  border-left: 5px solid ${({ type }) => getBorderColor(type)};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
  padding: 0;
  animation: ${({ show }) => (show ? fadeIn : fadeOut)} 0.5s forwards;
  display: ${({ show }) => (show ? 'block' : 'none')};
`;

const getBorderColor = (type) => {
  switch (type) {
    case 'success':
      return '#28a745';
    case 'error':
      return '#dc3545';
    case 'warning':
      return '#ffc107';
    default:
      return '#17a2b8';
  }
};

const ToastHeaderStyled = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ type }) => getHeaderColor(type)};
  color: #fff;
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  padding: 6px;
  font-size: 15px;
  font-weight: bold;
`;

const getHeaderColor = (type) => {
  switch (type) {
    case 'success':
      return '#28a745';
    case 'error':
      return '#dc3545';
    case 'warning':
      return '#ffc107';
    default:
      return '#17a2b8';
  }
};

const CloseButtonStyled = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  margin-left: auto;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

const ToastBodyStyled = styled.div`
  padding: 10px;
  font-size: 14px;
  color: #555;
  text-align: left;
`;

const IconWrapper = styled.div`
  display: inline-block;
  margin-right: 10px;
  font-size: 22px;
`;

const ToastComponent = ({ show, message, onClose, title, type }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <BsCheckCircle />;
      case 'error':
        return <BsXCircle />;
      case 'warning':
        return <BsExclamationTriangle />;
      default:
        return <BsInfoCircle />;
    }
  };

  return (
    <StyledToast show={show} type={type}>
      <ToastHeaderStyled type={type}>
        <IconWrapper>{getIcon(type)}</IconWrapper>
        <span>{title}</span>
        <CloseButtonStyled onClick={onClose}>×</CloseButtonStyled>
      </ToastHeaderStyled>
      <ToastBodyStyled>{message}</ToastBodyStyled>
    </StyledToast>
  );
};

export default ToastComponent;

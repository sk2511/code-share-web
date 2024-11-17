import React from 'react'
import { Modal } from 'react-bootstrap'
import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css'

function ConfirmationModal({
  show = false,
  onClose = () => {},
  onConfirm = () => {},
  title = '',
  bodyText = '',
}) {
  const NewCodeshareButton = styled.button`
    border-radius: 5px;
    background-color: #7e797c;
    border: none;
    color: #fff;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.3s ease;
    cursor: pointer;

    &:hover {
      background-color: #ec3360;
    }

    &.confirm {
      background-color: #4caf50;
    }

    &.cancel {
      background-color: #f44336;
    }

    &:hover.confirm {
      background-color: #388e3c;
    }

    &:hover.cancel {
      background-color: #d32f2f;
    }
  `

  const ModalBodyText = styled.p`
    font-size: 16px;
    font-weight: 500;
    color: #555;
    margin-bottom: 1rem;
  `

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ModalBodyText>{bodyText}</ModalBodyText>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-end gap-2">
        <NewCodeshareButton className="cancel" onClick={onClose}>
          No
        </NewCodeshareButton>
        <NewCodeshareButton className="confirm" onClick={onConfirm}>
          Yes
        </NewCodeshareButton>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmationModal

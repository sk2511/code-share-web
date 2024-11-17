import React from 'react'
import { Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

function ErrorPopUp({ show = false, onClose = () => {}, errorMessage = '' }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Maximum Room Limit Reached</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-3">{errorMessage}</p>
      </Modal.Body>
    </Modal>
  )
}

export default ErrorPopUp

import React, { useEffect, useState } from 'react'
import { Modal, Form, Button, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useToast } from './Toast/ToastContex'

function PopupModal({ show = false, onClose = () => {}, className = '' }) {
  // const [viewOnly, setViewOnly] = useState(false)
  const [currUrl, setCurrUrl] = useState('')
  const { toastMessage } = useToast();

  // const toggleViewOnly = () => {
  //   setViewOnly(!viewOnly)
  // }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(currUrl)
      .then(() => {
        toastMessage('URL copied to clipboard!', 'success')
        onClose()
      })
      .catch((err) => {
        toastMessage(err?.message || 'Something went wrong!', 'error')
      })
  }

  useEffect(() => {
    const currentURL = window.location.href
    setCurrUrl(currentURL)
  }, [])

  return (
    <Modal show={show} onHide={onClose} centered className={className}>
      <Modal.Header closeButton>
        <Modal.Title>Share Code</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-3">
          Share this URL to see your code in real time.
        </p>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="text-dark">Share this URL</Form.Label>
            <InputGroup>
              <Form.Control
                id="share-url"
                type="text"
                value={currUrl}
                readOnly
              />
              <Button variant="outline-secondary" onClick={() => handleCopy()}>
                <FontAwesomeIcon icon={faCopy} />
              </Button>
            </InputGroup>
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <Form.Label className="text-dark">"View only" mode</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Check
                type="switch"
                id="view-only"
                checked={viewOnly}
                onChange={toggleViewOnly}
                className="mr-2"
              />
              <span className="text-muted">{viewOnly ? 'ON' : 'OFF'}</span>
            </div>
            <p className="text-muted mt-2">
              Turn on "view only" mode if you don't want others to edit the
              code.
            </p>
          </Form.Group> */}
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default PopupModal

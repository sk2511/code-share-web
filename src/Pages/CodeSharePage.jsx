import React, { useEffect, useState, useContext } from 'react'
import { FaArrowLeft, FaTrash } from 'react-icons/fa'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../Components/SocketContext'
import ErrorPopUp from '../Components/ErrorPopUp'
import NotepadNavbar from '../Components/NotepadNavbar'
import { axiosGet, axiosPost } from '../Services/apiServices'
import ConfirmationModal from '../Components/ConfirmationModal'

const NewCodeshareButton = styled.button`
  border-radius: 5px;
  background-color: #ec3360;
  border: none;
  color: #fff;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin: 10px 0;
  &:hover {
    background-color: #ec3360;
  }
`
const BackButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  color: #171a1d;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
  margin-left: 20px;
`

const DeleteButton = styled.button`
  border-radius: 5px;
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  cursor: pointer;
  background-color: #ec3360;
  border-color: #ec3360;
  margin-left: 5px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #ea1c4e;
    border-color: #ea1c4e;
  }
`

const TableContainer = styled.div`
  margin: 30px auto;
  width: 100%;
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f8f9fa;
    font-weight: bold;
  }

  td {
    &:first-child {
      font-weight: bold;
      color: #007bff;
      cursor: pointer;
    }
  }

  .text-primary {
    color: #007bff;
  }
`

const CodeSharePage = () => {
  const [details, setDetails] = useState([])
  const navigate = useNavigate()
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState(null)
  const { userDetails, socketRef, TurnOnSocket } = useContext(SocketContext)
  const [openErrorPopUp, setOpenErrorPopUp] = useState(false)
  const handleGetRoomDetails = async () => {
    try {
      const response = await axiosGet('/get-codes')
      if (response?.status === 'success') {
        setDetails(response?.userRoomDetails)
      }
    } catch (error) {
      throw error
    }
  }

  const handleDeleteRoom = async () => {
    if (!selectedRoomId) return
    try {
      const response = await axiosPost('/remove-codes', {
        room_id: selectedRoomId,
      })
      if (response?.status === 'success') {
        const UpdatedDetails = details.filter(
          (item) => item?.id !== selectedRoomId
        )
        setDetails(UpdatedDetails)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setOpenConfirmationModal(false)
      setSelectedRoomId(null)
    }
  }

  const openDeleteModal = (id) => {
    setSelectedRoomId(id)
    setOpenConfirmationModal(true)
  }

  useEffect(() => {
    handleGetRoomDetails()
  }, [])

  const createRoom = () => {
    socketRef?.current?.emit(
      'addRoomId',
      {
        userId: userDetails?.id,
        title: '',
        syntax: 'C',
      },
      (data) => {
        if (data?.error) {
          setOpenErrorPopUp(true)
        }
        if (data?.roomId) {
          navigate(`/room/${data?.roomId}`)
        }
      }
    )
  }

  useEffect(() => {
    TurnOnSocket()
  }, [])

  return (
    <>
      <NotepadNavbar title="Codeshares" />
      <BackButton onClick={() => window.history.back()}>
        <FaArrowLeft style={{ marginRight: '5px' }} /> Back
      </BackButton>
      <div className="container mt-4">
        <h1>Your Codeshares</h1>
        <div className="d-flex justify-content-end">
          <NewCodeshareButton onClick={createRoom}>
            New Codeshare
          </NewCodeshareButton>
        </div>
        <TableContainer>
          <table className="table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Title</th>
                <th>Syntax</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {details?.map((code) => (
                <tr key={code?.id}>
                  <td>
                    <span
                      className="fw-bold text-primary clickable"
                      onClick={() => navigate(`/room/${code?.room_id}`)}
                    >
                      /{code?.room_id}
                    </span>
                  </td>
                  <td>
                    <span>{code?.title}</span>
                  </td>
                  <td>{code?.syntax}</td>
                  <td>
                    <time dateTime={code?.created_at}>
                      {new Date(code?.created_at).toLocaleDateString()}
                    </time>
                  </td>
                  <td className="text-center">
                    <DeleteButton
                      aria-label="Delete"
                      onClick={() => openDeleteModal(code?.id)}
                    >
                      <FaTrash />
                    </DeleteButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </div>
      <ErrorPopUp
        show={openErrorPopUp}
        onClose={() => {
          setOpenErrorPopUp(false)
        }}
        errorMessage="User cannot have more than 10 room entries."
      />
      <ConfirmationModal
        show={openConfirmationModal}
        onClose={() => setOpenConfirmationModal(false)}
        onConfirm={handleDeleteRoom}
        title="Delete Codeshare"
        bodyText="Are you sure you want to delete this codeshare?"
      />
    </>
  )
}

export default CodeSharePage

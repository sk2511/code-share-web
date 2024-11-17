import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { SocketContext } from './Components/SocketContext'
import { axiosGet } from './Services/apiServices'


const ProtectedRoute = ({ children }) => {
  const { setUserDetails } = useContext(SocketContext)
  const [isAuthorized, setIsAuthorized] = useState(null)

  const getUserDetails = async () => {
    try {
      const response = await axiosGet('/get-user')
      setUserDetails(response)
      return true
    } catch (error) {
      return false
    }
  }

  const checkToken = async () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      const payload = await getUserDetails()
      if (payload) {
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
    } else {
      setIsAuthorized(false)
    }
  }
  useEffect(() => {
    checkToken()
  }, [])

  if (isAuthorized === null) {
    return <div>Loading...</div>
  }

  if (!isAuthorized) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute

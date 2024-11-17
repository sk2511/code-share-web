import React from 'react'
import NotepadPage from './NotepadPage'
import HomePage from './HomePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './Signup/Signup'
import Login from './Login/Login'
import ProtectedRoute from '../ProtectedRoute'
import CodeSharePage from './CodeSharePage'
import AccountSettings from './AccountSetting'
import ForgotPassword from './ForgotPassword/ForgotPassword'
import ResetPassword from './ForgotPassword/ResetPassword'

export default function Router() {
  return (
   
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/room/:gropid"
          element={
            <ProtectedRoute>
              <NotepadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/codes"
          element={
            <ProtectedRoute>
              <CodeSharePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

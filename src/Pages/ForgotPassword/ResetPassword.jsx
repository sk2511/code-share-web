import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import img from '../../images/img4.webp'
import { useToast } from '../../Components/Toast/ToastContex'
import { axiosPost } from '../../Services/apiServices'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  background-image: url(${img});
  background-size: cover;
  background-position: center;
`

const FormContainer = styled.div`
  padding: 40px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
  width: 400px;
`

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`

const Button = styled.button`
  margin-top: 20px;
  background-color: #3b83c7;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: cornflowerblue;
  }
`

const validationSchema = Yup.object({
  password: Yup.string()
    .trim('Spaces Not Allowed')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires an uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords don't match")
    .required('Confirm Password is required'),
})

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { toastMessage } = useToast()
  const handleResetPassword = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true)
      const response = await axiosPost(`/reset-password/${token}`, {
        password: values.password,
        confirmPassword: values.confirmPassword,
      })
      if (response?.status === 'success') {
        setSubmitting(false)
        navigate('/login')
        toastMessage(response?.message, 'success', 'Success')
      }
    } catch (error) {
      setSubmitting(false)
      toastMessage(error?.message || 'Something went wrong!', 'error', 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Wrapper>
      <FormContainer>
        <Title>Reset Password</Title>
        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleResetPassword}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="New Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.password && touched.password ? 'is-invalid' : ''
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.password && touched.password && errors.password}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm New Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-control ${
                    errors.confirmPassword && touched.confirmPassword
                      ? 'is-invalid'
                      : ''
                  }`}
                />
                <div className="invalid-feedback">
                  {errors.confirmPassword &&
                    touched.confirmPassword &&
                    errors.confirmPassword}
                </div>
              </div>

              <Button type="submit">Reset Password</Button>
            </form>
          )}
        </Formik>
      </FormContainer>
    </Wrapper>
  )
}

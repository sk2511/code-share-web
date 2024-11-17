import React, { useContext } from 'react'
import styled from 'styled-components'
import { SocketContext } from '../Components/SocketContext'
import NotepadNavbar from '../Components/NotepadNavbar'
import { FaArrowLeft } from 'react-icons/fa'
import { useToast } from '../Components/Toast/ToastContex'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { axiosPost } from '../Services/apiServices'


const Container = styled.div`
  max-width: 600px;
  margin: 30px auto;
  margin-left: 300px;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
`

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`

const SaveButton = styled.button`
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
    background-color: #e82555;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`

const Label = styled.label`
  font-weight: bold;
  margin-top: 10px;
  display: block;
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

const AccountSettings = () => {
  const { userDetails, setUserDetails } = useContext(SocketContext)
  const { toastMessage } = useToast()

  const formik = useFormik({
    initialValues: {
      firstName: userDetails?.firstName || '',
      lastName: userDetails?.lastName || '',
      companyname: userDetails?.companyname || '',
      designation: userDetails?.designation || '',
      employee: userDetails?.employee || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim('Spaces Not Allowed')
        .required('First Name is required'),
      lastName: Yup.string()
        .trim('Spaces Not Allowed')
        .required('Last Name is required'),
      companyname: Yup.string()
        .trim('Spaces Not Allowed')
        .required('Company Name is required'),
      designation: Yup.string()
        .trim('Spaces Not Allowed')
        .required('Designation is required'),
      employee: Yup.number()
        .required('Employee Size is required')
        .min(1, 'Must be at least 1'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axiosPost('update-user', { ...values, userId: userDetails?.id })
        if (response?.status === 'success') {
          setUserDetails({ ...userDetails, ...values })
          toastMessage(
            'User details updated successfully.',
            'success',
            'Success'
          )
        }
      } catch (error) {
        toastMessage(error?.message || 'Something went wrong!', 'error', 'Error')
      }
    },
  })

  return (
    <>
      <NotepadNavbar title="Account Settings" />
      <BackButton onClick={() => window.history.back()}>
        <FaArrowLeft style={{ marginRight: '5px' }} /> Back
      </BackButton>
      <Container>
        <h1>Account Settings</h1>
        <form onSubmit={formik.handleSubmit}>
          <Label htmlFor="firstName">
            First Name <span style={{ color: 'red' }}>*</span>
          </Label>
          <InputField
            type="text"
            id="firstName"
            {...formik.getFieldProps('firstName')}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div style={{ color: 'red' }}>{formik.errors.firstName}</div>
          ) : null}

          <Label htmlFor="lastName">
            Last Name <span style={{ color: 'red' }}>*</span>
          </Label>
          <InputField
            type="text"
            id="lastName"
            {...formik.getFieldProps('lastName')}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div style={{ color: 'red' }}>{formik.errors.lastName}</div>
          ) : null}

          <Label>
            Email <span style={{ color: 'red' }}>*</span>
          </Label>
          <InputField
            type="email"
            value={userDetails?.email}
            readOnly
            style={{
              pointerEvents: 'none',
              cursor: 'not-allowed',
              backgroundColor: '#e0e3e5',
            }}
          />

          <Label htmlFor="companyname">
            Company Name <span style={{ color: 'red' }}>*</span>
          </Label>
          <InputField
            type="text"
            id="companyname"
            {...formik.getFieldProps('companyname')}
          />
          {formik.touched.companyname && formik.errors.companyname ? (
            <div style={{ color: 'red' }}>{formik.errors.companyname}</div>
          ) : null}

          <Label htmlFor="designation">
            Designation <span style={{ color: 'red' }}>*</span>
          </Label>
          <InputField
            type="text"
            id="designation"
            {...formik.getFieldProps('designation')}
          />
          {formik.touched.designation && formik.errors.designation ? (
            <div style={{ color: 'red' }}>{formik.errors.designation}</div>
          ) : null}

          <Label htmlFor="employee">
            Employee Size <span style={{ color: 'red' }}>*</span>
          </Label>
          <InputField
            type="number"
            id="employee"
            {...formik.getFieldProps('employee')}
            min="1"
          />
          {formik.touched.employee && formik.errors.employee ? (
            <div style={{ color: 'red' }}>{formik.errors.employee}</div>
          ) : null}

          <SaveButton
            type="submit"
            disabled={!(formik.isValid && formik.dirty)}
          >
            Save Changes
          </SaveButton>
        </form>
      </Container>
    </>
  )
}

export default AccountSettings

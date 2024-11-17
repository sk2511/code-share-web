import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import styled from 'styled-components'
import { Form } from 'react-bootstrap'
import img from '../../images/img4.webp'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../Components/Toast/ToastContex'
import { axiosPost } from '../../Services/apiServices'


const Container = styled.div`
  background-image: url(${img});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const FormWrapper = styled.div`
  background: white;
  padding: 60px 40px;
  border-radius: 10px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  width: 400px;
`

const Title = styled.h4`
  text-align: center;
`

const Button = styled.button`
  margin-top: 23px;
  background-color: #3b83c7;
  border: none;
  border-radius: 50px;
  padding: 12px;
  color: white;
  width: 100%;

  &:hover {
    background-color: cornflowerblue;
  }
`

const validationSchema = Yup.object({
  email: Yup.string()
    .trim('Spaces Not Allowed')
    .strict(false)
    .test('Validate Email', 'Invalid email address', (value) => {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(value).toLowerCase())
    })
    .required('Email is required'),
})

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { toastMessage } = useToast()

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true)
      const response = await axiosPost('/forgot-password', {
        email: values.email,
      })
      toastMessage(response?.message, 'success', 'Success')
      navigate('/login')
    } catch (error) {
      toastMessage(error?.message || 'Something went wrong!', 'error', 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Container>
      <FormWrapper>
        <Title>Forgot Password</Title>
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            handleBlur,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email address"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.email && touched.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email && touched.email && errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit">Submit</Button>
            </Form>
          )}
        </Formik>
      </FormWrapper>
    </Container>
  )
}

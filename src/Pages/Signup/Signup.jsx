import Form from 'react-bootstrap/Form'
import { BsPersonCircle } from 'react-icons/bs'
import { Formik } from 'formik'
import * as Yup from 'yup'
import styled from 'styled-components'
import img from '../../images/img4.webp'
import { devices } from '../device/devices'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../Components/Toast/ToastContex'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { axiosPost } from '../../Services/apiServices'


export default function Signup() {
  const navigate = useNavigate()
  const { toastMessage } = useToast()

  const validationSchema = Yup.object({
    firstname: Yup.string()
      .trim('Spaces Not Allowed')
      .strict(false)
      .required('required'),
    lastname: Yup.string()
      .trim('Spaces Not Allowed')
      .strict(false)
      .required('required'),
    companyname: Yup.string()
      .trim('Spaces Not Allowed')
      .strict(false)
      .required('required'),
    designation: Yup.string()
      .trim('Spaces Not Allowed')
      .strict(false)
      .required('required'),
    employee: Yup.string()
      .trim('Spaces Not Allowed')
      .strict(false)
      .required('required'),
    email: Yup.string()
      .trim('Spaces Not Allowed')
      .strict(false)
      .test('Validate Email', (value) => {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(value).toLowerCase())
      })
      .required('required'),
    password: Yup.string()
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol')
      .required('required'),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('required'),
  })

  const Image = styled.div`
    background-image: url(${img});
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    min-height: 100vh;
    width: 100%;
  `

  const Button = styled.button`
    margin-top: 23px;
    background-color: #3b83c7 !important;
    border: transparent !important;
    border-radius: 50px !important;
    padding: 10px 0px !important;
    color: white;
    width: 50%;
    margin-left: 25%;
    font-size: 18px;
    font-weight: 600;
    box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%),
      0 1px 18px 0 rgb(0 0 0 / 12%);

    &:hover {
      background-color: cornflowerblue !important;
    }
  `

  const Wrapper = styled.section`
    .link_btn1 a {
      text-decoration: none;
    }
    .link_btn1 {
      margin: 28px;
      text-align: center;
    }
    .mr-l {
      margin-left: 10px;
    }
    .form-control:focus {
      color: #212529;
      background-color: #fff;
      border-color: #ced4da;
      outline: 0;
      box-shadow: 0 0 0 0rem rgb(13 110 253 / 25%);
      max-width: 100%;
    }
  `

  const Lgform = styled.form`
    padding: 40px 40px 1px;
    background: #fff;
    box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%),
      0 1px 18px 0 rgb(0 0 0 / 12%);
    border-radius: 10px;
    margin-bottom: 30px;
  `

  const Title = styled.h4`
    text-align: center;
  `

  const Logo = styled.div`
    text-align: center;
    font-size: 80px;
    color: #3b83c7;
  `

  const Loginpage = styled.div`
    width: 1000px;
    @media ${devices.mobileL} {
      width: 300px;
    }
    @media ${devices.mobileS} {
      width: 250px;
    }
  `

  const onSubmit = async (values, setSubmitting) => {
    try {
      setSubmitting(true)
      await axiosPost('/signup', values)
      navigate('/login')
      toastMessage('Your registration is successful', 'success', 'Success')
    } catch (error) {
      setSubmitting(false)
      toastMessage(error?.message || 'Something went wrong!', 'error', 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Wrapper>
      <div>
        <Image className="img">
          <div className="Login_form d-flex justify-content-center align-items-center">
            <Formik
              initialValues={{
                firstname: '',
                lastname: '',
                companyname: '',
                designation: '',
                employee: '',
                email: '',
                password: '',
                confirmpassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                onSubmit(values, setSubmitting)
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleSubmit,
                handleBlur,
              }) => (
                <Loginpage className="loginpage">
                  <Logo className="user_icon">
                    <BsPersonCircle />
                  </Logo>
                  <Lgform
                    noValidate
                    onSubmit={handleSubmit}
                    className="form ps-r  mr-t"
                  >
                    <Title className="text_edit">Sign Up</Title>
                    <Row className="align-items-start mb-4 g-3">
                      {' '}
                      <Col>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label className="mb-0">First Name </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="firstname"
                            className="input"
                            name="firstname"
                            value={values.firstname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.firstname && touched.firstname}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.firstname &&
                              touched.firstname &&
                              errors.firstname}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label className="mb-0">Email</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="email"
                            className="input"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.email && touched.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email && touched.email && errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label className="mb-0">Designation</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="designation"
                            className="input"
                            name="designation"
                            value={values.designation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              errors.designation && touched.designation
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.designation &&
                              touched.designation &&
                              errors.designation}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label className="mb-0">Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="............"
                            className="input "
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.password && touched.password}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.password &&
                              touched.password &&
                              errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label className="mb-0">Last Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="lastname"
                            className="input"
                            name="lastname"
                            value={values.lastname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.lastname && touched.lastname}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.lastname &&
                              touched.lastname &&
                              errors.lastname}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label className="mb-0">Company Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="companyname"
                            className="input"
                            name="companyname"
                            value={values.companyname}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              errors.companyname && touched.companyname
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.companyname &&
                              touched.companyname &&
                              errors.companyname}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label className="mb-0">
                            Number of Employees
                          </Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="no. of employee"
                            className="input"
                            min={0}
                            name="employee"
                            value={values.employee}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.employee && touched.employee}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.employee &&
                              touched.employee &&
                              errors.employee}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label className="mb-0">
                            Confirm Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="............"
                            className="input"
                            name="confirmpassword"
                            value={values.confirmpassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              errors.confirmpassword && touched.confirmpassword
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.confirmpassword &&
                              touched.confirmpassword &&
                              errors.confirmpassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button type="submit">Sign Up</Button>
                    <div className="link_btn1">
                      <span className="mr-l">
                        Already have an account?
                        <Link to="/login"> Login</Link>
                      </span>
                    </div>
                  </Lgform>
                </Loginpage>
              )}
            </Formik>
          </div>
        </Image>
      </div>
    </Wrapper>
  )
}

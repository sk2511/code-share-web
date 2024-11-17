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
import { axiosPost } from '../../Services/apiServices'


export default function Login() {
  const navigate = useNavigate()
  const { toastMessage } = useToast()
  const validationSchema = Yup.object({
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
      .trim('Spaces Not Allowed')
      .strict(false)
      .matches(/[0-9]/, 'Password requires a number')
      .matches(/[a-z]/, 'Password requires a lowercase letter')
      .matches(/[A-Z]/, 'Password requires an uppercase letter')
      .matches(/[^\w]/, 'Password requires a symbol')
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
    display: flex;
    justify-content: center;
    align-items: center;
  `
  const Button = styled.button`
    margin-top: 23px;
    background-color: #3b83c7 !important;
    border: transparent !important;
    border-radius: 50px !important;
    padding: 3% 30% !important;
    color: white !important ;

    &:hover {
      background-color: cornflowerblue !important;
    }
  `
  const Wrapper = styled.section`
    .link_btn a {
      text-decoration: none;
    }
    .link_btn {
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
    }
  `
  const Lgform = styled.form`
    padding: 60px 40px 40px;
    background: #fff;
    box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%),
      0 1px 18px 0 rgb(0 0 0 / 12%);
    border-radius: 10px;
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
    width: 400px;
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
      const res = await axiosPost('/signin', values)
      localStorage.setItem('accessToken', res?.accessToken)
      const roomId = res?.roomId
      navigate(`/room/${roomId}`)
    } catch (error) {
      setSubmitting(false)
      toastMessage(error?.message || 'Something went wrong!', 'error', 'Error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Wrapper>
        <Image className="bg_img">
          <div className="Login_form ">
            <Formik
              initialValues={{
                email: '',
                password: '',
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
                    className="form ps-r mr-t"
                  >
                    <Title className="text_edit">Log In</Title>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email address"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.email && touched.email}
                      />
                      <Form.Control.Feedback type="invalid" className="">
                        {errors.email && touched.email && errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group
                      className="mb-3 mt-4"
                      controlId="formBasicPassword"
                    >
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="............"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={errors.password && touched.password}
                      />
                      <Form.Control.Feedback type="invalid" className="">
                        {errors.password && touched.password && errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-center mt-4">
                      <Button
                        variant="primary"
                        type="submit"
                      >
                        Log In
                      </Button>
                    </div>

                    <div className="link_btn">
                      <Link to="/forgot-password" className="mr-l">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="link_btn">
                      No account?
                      <Link to="/signup" className="mr-l">
                        Sign Up
                      </Link>
                    </div>
                  </Lgform>
                </Loginpage>
              )}
            </Formik>
          </div>
        </Image>
      </Wrapper>
    </>
  )
}

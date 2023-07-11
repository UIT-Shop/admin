import axios from 'axios'
import jwt from 'jwt-decode'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import eyeOff from '../../common/assets/sign_in/eye_off.png'
import eyeOn from '../../common/assets/sign_in/eye_on.png'
import imageShop from '../../common/assets/sign_in/thrift-shop-rafiki.png'
import { checkValidEmail } from '../../common/validate/valid-email'
import { checkValidPassword } from '../../common/validate/valid-password'

const Login = () => {
  const [visibility, setVisibility] = useState(eyeOff)
  const [inputType, setInputType] = useState('password')
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState('')
  const [validEmail, setValidEmail] = useState(true)
  const [validPassword, setValidPassword] = useState(true)
  const [emailError, setEmailError] = useState()
  const [checkEmptyPassword, setCheckEmptyPassword] = useState(true)
  const [isRememberMe, setIsRemember] = useState(false)

  const navigate = useNavigate()

  const setLocalStorages = (token, user) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_name', user[Object.keys(user)[1]])
    localStorage.setItem('auth_email', user[Object.keys(user)[2]])
  }
  const removeLocalStorages = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_name')
    localStorage.removeItem('auth_email')
  }
  let changeVisibilityHandler = () => {
    if (visibility === eyeOn) {
      setVisibility(eyeOff)
      setInputType('password')
    }
    if (visibility === eyeOff) {
      setVisibility(eyeOn)
      setInputType('text')
    }
  }

  const [loginInput, setLogin] = useState({
    email: '',
    password: '',
    error_list: []
  })

  const handleInput = (e) => {
    e.persist()
    setLogin({ ...loginInput, [e.target.name]: e.target.value })
  }

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      loginSubmit(e)
    }
  }
  const loginSubmit = (e) => {
    e.preventDefault()
    setError('')
    setValidEmail(checkValidEmail(loginInput.email))
    setValidPassword(checkValidPassword(loginInput.password))
    setCheckEmptyPassword(loginInput.password)

    if (!checkValidEmail(loginInput.email)) {
      setEmailError(loginInput.autoCloseemail ? 'Email sai định dạng' : 'Email không được để trống')
    }

    if (checkValidEmail(loginInput.email) && loginInput.password) {
      axios
        .post(`/Auth/login`, {
          email: loginInput.email,
          password: loginInput.password
        })
        .then((res) => {
          if (res.status === 200) {
            const token = res.data.data
            const user = jwt(token)
            setLocalStorages(token, user)

            if (user[Object.keys(user)[3]] === 'Admin') {
              toast.success('Đăng nhập thành công', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
              })
              navigate('/admin/dashboard')
            } else {
              toast.warning('Bạn không có quyền truy cập trang này', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
              })
              navigate('/login')
            }
          } else if (res.status === 401) {
            toast.warning('Sai email hoặc mật khẩu', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
          }
          if (isRememberMe) {
            // setLocalStorages(loginInput.email, loginInput.password);
          } else {
            // const emailInCookies = Cookies.get('userEmail');
            // const passwordInCookies = Cookies.get('userPassword');
            // if (
            //   emailInCookies === data.email &&
            //   passwordInCookies === data.password
            // ) {
            //   removeLocalStorages();
            // }
          }
        })
        .catch((err) => {
          if (err.response) {
            // The client was given an error response (5xx, 4xx)
            if (err.response.status === 400)
              toast.error('Sai tài khoản hoặc mật khẩu', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
              })
          } else if (err.request) {
            // The client never received a response, and the request was never left (4xx)
            toast.error(err.request.data.message, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
          } else {
            // Anything else
            console.log('Error', err.message)
          }
        })
    }
  }

  return (
    <div className="maincontainer">
      <div className="container-fluid">
        <div className="row no-gutter">
          <div className="col-md-6 ">
            <div className="align-items-center py-5">
              <img className="w-75" src={imageShop}></img>
            </div>
          </div>

          <div className="col-md-6 bg-light">
            <div className="login d-flex align-items-center py-5">
              <ToastContainer />
              <div className="container mt-5 mb-5">
                <div className="row">
                  <div className="col-lg-10 col-xl-7 mx-auto">
                    <form id="sign-in" onSubmit={loginSubmit}>
                      <h3 className="display-4">Đăng nhập</h3>
                      <p className="text-muted mb-4">Đăng nhập vào hệ thống</p>
                      <div className="mb-3">
                        <input
                          id="inputEmail"
                          onKeyUp={handleKeypress}
                          onChange={handleInput}
                          name="email"
                          type="email"
                          placeholder="Email"
                          required=""
                          autoFocus=""
                          className="form-control rounded-pill border-0 shadow-sm px-4"
                        />
                        {!validEmail && <small className="text-danger">{emailError}</small>}
                      </div>
                      <div className="mb-3">
                        <input
                          id="inputPassword"
                          onKeyUp={handleKeypress}
                          onChange={handleInput}
                          name="password"
                          type="password"
                          placeholder="Mật khẩu"
                          required=""
                          className="form-control rounded-pill border-0 shadow-sm px-4 text-primary"
                        />
                        {!checkEmptyPassword && (
                          <small className="text-danger">Mật khẩu không được để trống</small>
                        )}
                      </div>
                      {/* <div class="form-check">
                                                    <input id="customCheck1" type="checkbox" checked class="form-check-input" />
                                                    <label for="customCheck1" class="form-check-label">Remember password</label>
                                                </div> */}
                      <div className="d-grid gap-2 mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">
                          Đăng nhập
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div>
    //   <div className="container py-5">
    //     <div className="row justify-content-center">
    //       <div className="col-md-6">
    //         <div className="card">
    //           <div className="card-header">
    //             <h4>Login</h4>
    //           </div>
    //           <div className="card-body">
    //             <form onSubmit={loginSubmit}>
    //               <div className="form-group mb-3">
    //                 <label>Email </label>
    //                 <input
    //                   type="email"
    //                   name="email"
    //                   onChange={handleInput}
    //                   onKeyUp={handleKeypress}
    //                   value={loginInput.email}
    //                   className="form-control"
    //                 />
    //                 {!validEmail && (
    //                   <small className="text-danger">{emailError}</small>
    //                 )}
    //               </div>
    //               <div className="form-group mb-3">
    //                 <label>Password</label>
    //                 <input
    //                   type="password"
    //                   name="password"
    //                   onChange={handleInput}
    //                   onKeyUp={handleKeypress}
    //                   value={loginInput.password}
    //                   className="form-control"
    //                 />
    //                 {!checkEmptyPassword && (
    //                   <small className="text-danger">
    //                     Mật khẩu không được để trống
    //                   </small>
    //                 )}
    //               </div>
    //               <div className="form-group mb-3">
    //                 <button type="submit" className="btn btn-primary">
    //                   Login
    //                 </button>
    //                 <ToastContainer />
    //               </div>
    //             </form>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}

export default Login

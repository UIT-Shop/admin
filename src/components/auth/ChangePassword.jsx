import axios from 'axios'
import jwt from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { Role } from '../../common/constant/Role'
import '../user/Profile.css'

function ChangePassword() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 1,
    address: {}
  })

  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    let isMounted = true
    const token = localStorage.getItem('auth_token')
    const user = jwt(token)
    const useId = user[Object.keys(user)[0]]

    axios.get(`/user/info/${useId}`).then(async (res) => {
      if (isMounted) {
        setUser(res.data.data)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const handleInput = (e) => {
    e.persist()
    setPassword({ ...password, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (password.newPassword !== password.confirmPassword) {
      toast.error('Mật khẩu mới và mật khẩu xác thực không giống nhau', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
      return false
    }
    if (password.newPassword.length < 6) {
      toast.error('Vui lòng điền đúng định dạng mật khẩu', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
      return false
    }
    return true
  }

  const changePassword = (e) => {
    e.preventDefault()
    if (!validate()) {
      return
    }
    axios
      .post('/auth/change-password', password)
      .then(() => {
        toast.success('Đổi mật khẩu thành công', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored'
        })
        navigate('/admin/profile')
      })
      .catch((err) => {
        if (err.response) {
          // The client was given an error response (5xx, 4xx)
          console.log('Error response', err.response)
          if (err.response.status === 400)
            toast.error('Sai mật khẩu cũ', {
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
          console.log('Error request', err.request)
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

  return (
    <div className="page-content page-container" id="page-content">
      <div className="p-5">
        <div className="row container d-flex justify-content-center">
          <div className="col-12 col-md-8">
            <div className="card user-card-full">
              <div className="row mx-0">
                <div className="col-sm-4 bg-c-lite-green user-profile">
                  <div className="card-block text-center text-white">
                    <div className="mb-4">
                      <img
                        src="https://img.icons8.com/bubbles/100/000000/user.png"
                        className="img-radius"
                        alt="User-Profile-Image"
                      />
                      <ToastContainer />
                    </div>
                    <h6 className="f-w-600">{user.name}</h6>
                    <p>{user.role ? Role.Ad : Role.Cus}</p>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block">
                    <h6 className="mb-2 pb-1 b-b-default f-w-600">Thông tin</h6>
                    <div className="row mb-2">
                      <div className="col-12 ">
                        <label className="labels">Mật khẫu cũ</label>
                        <input
                          type="password"
                          name="oldPassword"
                          className="form-control"
                          placeholder="Mật khẫu cũ"
                          value={password.oldPassword}
                          onChange={handleInput}
                        />
                      </div>
                      <div className="col-12 ">
                        <label className="labels">Mật khẩu mới</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Mật khẩu mới"
                          name="newPassword"
                          onChange={handleInput}
                          value={password.newPassword}
                        />
                      </div>
                      <div className="col-12 ">
                        <label className="labels">Nhập lại mật khẩu </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Nhập lại mật khẩu"
                          name="confirmPassword"
                          onChange={handleInput}
                          value={password.confirmPassword}
                        />
                      </div>
                    </div>
                    <h6 className="mb-2 m-t-40 pb-1 b-b-default f-w-600">Yêu cầu</h6>
                    <h6 className="text-muted f-w-400">
                      <ul>
                        <li>Tối thiểu: 6 ký tự</li>
                        <li>Tối đa: 100 ký tự</li>
                      </ul>
                    </h6>
                    <div className="d-flex justify-content-around mt-2">
                      <button className="btn btn-primary " onClick={changePassword}>
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword

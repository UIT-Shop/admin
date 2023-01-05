import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Stack, Tab, Tabs } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { ProductType } from '../../common/constant/ProductType'

function EditCategory(props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [categoryInput, setCategory] = useState([])
  const [error, setError] = useState([])
  const [currentTab, setCurrentTab] = useState(0)
  const { id } = useParams()
  useEffect(() => {
    axios
      .get(`/Category/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setCategory(res.data.data)
        } else if (res.status === 400) {
          toast.error('Lỗi lấy dữ liệu', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          })
          navigate('/admin/view-category')
        }
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        if (err.response) {
          // The client was given an error response (5xx, 4xx)
          toast.error('Dữ liệu không tồn tại', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          })
          navigate('/admin/view-category')
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
  }, [id])

  const handleInput = (e) => {
    e.persist()
    setCategory({ ...categoryInput, [e.target.name]: e.target.value })
  }

  const updateCategory = (e) => {
    e.preventDefault()
    axios
      .put(`/Category`, {
        id: id,
        name: categoryInput.name,
        url: categoryInput.url,
        gender: categoryInput.gender,
        type: categoryInput.type,
        meta_title: categoryInput.meta_title,
        meta_keyword: categoryInput.meta_keyword,
        meta_descrip: categoryInput.meta_descrip
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Cập nhật thành công', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          })
          navigate('/admin/view-category')
        }
      })
      .catch((err) => {
        setError(err.response.data.message)
      })
  }
  const next = (e) => {
    e.preventDefault()
    setCurrentTab((prev) => parseInt(prev) + 1)
  }
  const prev = (e) => {
    e.preventDefault()
    setCurrentTab((prev) => parseInt(prev) - 1)
  }
  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>
  }

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Sửa phân loại
            <Link to="/admin/view-category" className="btn btn-primary float-end">
              Xem phân loại
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={updateCategory} encType="multipart/form-data">
            <Tabs
              activeKey={parseInt(currentTab)}
              onSelect={(k) => setCurrentTab(k)}
              id="controlled-tab-example">
              <Tab eventKey={0} title="Phân loại">
                <div
                  className="tab-pane card-body border fade show active"
                  id="category"
                  role="tabpanel"
                  aria-labelledby="category-tab">
                  <div className="form-group mb-4">
                    <label>Tên</label>
                    <input
                      type="text"
                      name="name"
                      onChange={handleInput}
                      value={categoryInput.name}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-4">
                    <div>
                      <label>Giới tính</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        onChange={handleInput}
                        name="gender"
                        id="inlineRadio1"
                        value="Nam"
                      />
                      <label className="form-check-label" htmlFor="inlineRadio1">
                        Nam
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        onChange={handleInput}
                        id="inlineRadio2"
                        value="Nữ"
                      />
                      <label className="form-check-label" htmlFor="inlineRadio2">
                        Nữ
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        onChange={handleInput}
                        id="inlineRadio3"
                        value="Unisex"
                      />
                      <label className="form-check-label" htmlFor="inlineRadio3">
                        Unisex
                      </label>
                    </div>
                  </div>
                  <div className="form-group mb-4">
                    <label>Loại</label>
                    <select
                      name="type"
                      onChange={handleInput}
                      value={categoryInput.type}
                      className="form-control">
                      <option>Chọn loại</option>
                      {ProductType.map((item, index) => (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Tab>
              <Tab eventKey={1} title="SEO">
                <div
                  className="tab-pane card-body border fade show active"
                  id="seotags"
                  role="tabpanel"
                  aria-labelledby="seotags-tab">
                  <div className="form-group mb-4">
                    <label>Meta Title</label>
                    <input
                      type="text"
                      name="meta_title"
                      onChange={handleInput}
                      value={categoryInput.meta_title}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label>Meta Keyword</label>
                    <textarea
                      name="meta_keyword"
                      onChange={handleInput}
                      value={categoryInput.meta_keyword}
                      className="form-control"></textarea>
                  </div>
                  <div className="form-group mb-4">
                    <label>Meta Description</label>
                    <textarea
                      name="meta_descrip"
                      onChange={handleInput}
                      value={categoryInput.meta_descrip}
                      className="form-control"></textarea>
                  </div>
                </div>
              </Tab>
            </Tabs>
            <Stack gap={3} direction="horizontal" className="float-end mt-2">
              {parseInt(currentTab) === 1 ? (
                <Button className="success" onClick={prev}>
                  Quay lại
                </Button>
              ) : null}

              {parseInt(currentTab) === 0 ? (
                <Button className="success" onClick={next}>
                  Tiếp
                </Button>
              ) : null}
              {parseInt(currentTab) === 1 ? (
                <button type="submit" className="btn btn-primary px-4 ">
                  Gửi
                </button>
              ) : null}
            </Stack>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCategory

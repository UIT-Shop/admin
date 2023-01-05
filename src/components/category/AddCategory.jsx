import axios from 'axios'
import React, { useState } from 'react'
import { Button, Stack, Tab, Tabs } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { ProductType } from '../../common/constant/ProductType'

const AddCategory = () => {
  const [categoryInput, setCategory] = useState({
    name: '',
    url: '',
    gender: '',
    type: '',
    meta_title: '',
    meta_keyword: '',
    meta_descrip: '',
    error_list: []
  })
  const [currentTab, setCurrentTab] = useState(0)

  const handleInput = (e) => {
    e.persist()
    setCategory({ ...categoryInput, [e.target.name]: e.target.value })
  }

  const submitCategory = async (e) => {
    e.preventDefault()
    axios
      .post(`/Category`, {
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
          e.target.reset()
          toast.success('Thêm thành công', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          })
          // document.getElementById('CATEGORY_FORM').reset();
        } else if (res.status === 400) {
          setCategory({ ...categoryInput, error_list: res.data.errors })
        }
      })
      .catch((err) => {
        setCategory({
          ...categoryInput,
          error_list: err.response.data.message
        })
      })
  }

  var display_errors = []
  if (categoryInput.error_list) {
    display_errors.push(categoryInput.error_list)
  }
  const next = (e) => {
    e.preventDefault()
    setCurrentTab((prev) => parseInt(prev) + 1)
  }
  const prev = (e) => {
    e.preventDefault()
    setCurrentTab((prev) => parseInt(prev) - 1)
  }
  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Thêm phân loại
            <Link to="/admin/view-category" className="btn btn-primary float-end">
              Xem phân loại
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={submitCategory} encType="multipart/form-data">
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
                  {/* <div className="form-group mb-4">
                  <label>Url</label>
                  <input
                    type="text"
                    name="url"
                    onChange={handleInput}
                    value={categoryInput.url}
                    className="form-control"
                  />
                </div> */}

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
                    <small className="text-danger">{display_errors.meta_title}</small>
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

export default AddCategory

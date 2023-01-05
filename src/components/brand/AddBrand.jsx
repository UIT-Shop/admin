import axios from 'axios'
import React, { useState } from 'react'
import { Button, Stack, Tab, Tabs } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

const AddBrand = () => {
  const [brandInput, setBrand] = useState({
    name: '',
    url: '',
    meta_title: '',
    meta_keyword: '',
    meta_descrip: '',
    error_list: []
  })
  const [currentTab, setCurrentTab] = useState(0)

  const handleInput = (e) => {
    e.persist()
    setBrand({ ...brandInput, [e.target.name]: e.target.value })
  }

  const submitBrand = (e) => {
    e.preventDefault()
    if (brandInput.name.trim().length === 0) {
      toast.error('Vui lòng điền tên thương hiệu', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
      return
    }
    axios
      .post(`/Brand`, {
        name: brandInput.name,
        url: brandInput.url,
        meta_title: brandInput.meta_title,
        meta_keyword: brandInput.meta_keyword,
        meta_descrip: brandInput.meta_descrip
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
          // document.getElementById('BRAND_FORM').reset();
        } else if (res.status === 400) {
          setBrand({ ...brandInput, error_list: res.data.errors })
        }
      })
      .catch((err) => {
        setBrand({
          ...brandInput,
          error_list: err.response.data.message
        })
      })
  }

  var display_errors = []
  if (brandInput.error_list) {
    display_errors.push(brandInput.error_list)
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
            Thêm nhãn hiệu
            <Link to="/admin/view-brand" className="btn btn-primary float-end">
              Xem nhãn hiệu
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={submitBrand} encType="multipart/form-data">
            <Tabs
              activeKey={parseInt(currentTab)}
              onSelect={(k) => setCurrentTab(k)}
              id="controlled-tab-example">
              <Tab eventKey={0} title="Thương hiệu">
                <div
                  className="tab-pane card-body border fade show active"
                  id="brand"
                  role="tabpanel"
                  aria-labelledby="brand-tab">
                  <div className="form-group mb-4">
                    <label>Tên</label>
                    <input
                      type="text"
                      name="name"
                      onChange={handleInput}
                      value={brandInput.name}
                      className="form-control"
                    />
                  </div>
                  {/* <div className="form-group mb-4">
                  <label>Url</label>
                  <input
                    type="text"
                    name="url"
                    onChange={handleInput}
                    value={brandInput.url}
                    className="form-control"
                  />
                </div> */}
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
                      value={brandInput.meta_title}
                      className="form-control"
                    />
                    <small className="text-danger">{display_errors.meta_title}</small>
                  </div>
                  <div className="form-group mb-4">
                    <label>Meta Keyword</label>
                    <textarea
                      name="meta_keyword"
                      onChange={handleInput}
                      value={brandInput.meta_keyword}
                      className="form-control"></textarea>
                  </div>
                  <div className="form-group mb-4">
                    <label>Meta Description</label>
                    <textarea
                      name="meta_descrip"
                      onChange={handleInput}
                      value={brandInput.meta_descrip}
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

export default AddBrand

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Stack, Tabs, Tab, Row, Button, Col, Container } from 'react-bootstrap';

function EditBrand(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [brandInput, setBrand] = useState([]);
  const [error, setError] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/Brand/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setBrand(res.data.data);
        } else if (res.status === 400) {
          toast.error('Lỗi lấy dữ liệu', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          navigate('/admin/view-brand');
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
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
            theme: 'colored',
          });
          navigate('/admin/view-brand');
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
            theme: 'colored',
          });
        } else {
          // Anything else
          console.log('Error', err.message);
        }
      });
  }, [id]);

  const handleInput = (e) => {
    e.persist();
    setBrand({ ...brandInput, [e.target.name]: e.target.value });
  };
  const next = (e) => {
    e.preventDefault();
    setCurrentTab((prev) => prev + 1);
  };
  const prev = (e) => {
    e.preventDefault();
    setCurrentTab((prev) => prev - 1);
  };
  const updateBrand = (e) => {
    e.preventDefault();
    axios
      .put(`/Brand`, {
        id: id,
        name: brandInput.name,
        url: brandInput.url,
        gender: brandInput.gender,
        meta_title: brandInput.meta_title,
        meta_keyword: brandInput.meta_keyword,
        meta_descrip: brandInput.meta_descrip,
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
            theme: 'colored',
          });
          navigate('/admin/view-brand');
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>;
  }

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Sửa thương hiệu
            <Link to="/admin/view-brand" className="btn btn-primary float-end">
              Xem thương hiệu
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={updateBrand} encType="multipart/form-data">
            <Tabs activeKey={currentTab} id="controlled-tab-example">
              <Tab eventKey={0} title="Thương hiệu" disabled={currentTab !== 0}>
                <div
                  className="tab-pane card-body border fade show active"
                  id="brand"
                  role="tabpanel"
                  aria-labelledby="brand-tab"
                >
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
              <Tab eventKey={1} title="SEO" disabled={currentTab !== 1}>
                <div
                  className="tab-pane card-body border fade show active"
                  id="seotags"
                  role="tabpanel"
                  aria-labelledby="seotags-tab"
                >
                  <div className="form-group mb-4">
                    <label>Meta Title</label>
                    <input
                      type="text"
                      name="meta_title"
                      onChange={handleInput}
                      value={brandInput.meta_title}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label>Meta Keyword</label>
                    <textarea
                      name="meta_keyword"
                      onChange={handleInput}
                      value={brandInput.meta_keyword}
                      className="form-control"
                    ></textarea>
                  </div>
                  <div className="form-group mb-4">
                    <label>Meta Description</label>
                    <textarea
                      name="meta_descrip"
                      onChange={handleInput}
                      value={brandInput.meta_descrip}
                      className="form-control"
                    ></textarea>
                  </div>
                </div>
              </Tab>
            </Tabs>
            <Stack gap={3} direction="horizontal" className="float-end mt-2">
              {currentTab === 1 ? (
                <Button
                  className="success"
                  disabled={currentTab === 0}
                  onClick={prev}
                >
                  Quay lại
                </Button>
              ) : null}

              {currentTab === 0 ? (
                <Button
                  className="success"
                  disabled={currentTab === 2}
                  onClick={next}
                >
                  Tiếp
                </Button>
              ) : null}
              {currentTab === 1 ? (
                <button type="submit" className="btn btn-primary px-4 ">
                  Gửi
                </button>
              ) : null}
            </Stack>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditBrand;

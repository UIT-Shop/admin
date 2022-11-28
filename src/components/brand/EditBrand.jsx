import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function EditBrand(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [brandInput, setBrand] = useState([]);
  const [error, setError] = useState([]);
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
          console.log('Error response', err.response);
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
          console.log('Error request', err.request);
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

  const updateBrand = (e) => {
    e.preventDefault();

    // const brand_id = props.match.params.id;
    // const data = brandInput;
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
    return <h4>Loading Edit Brand...</h4>;
  }

  return (
    <div className="container px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Edit Brand
            <Link to="/admin/view-brand" className="btn btn-primary  float-end">
              BACK
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={updateBrand}>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  Home
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="seo-tags-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#seo-tags"
                  type="button"
                  role="tab"
                  aria-controls="seo-tags"
                  aria-selected="false"
                >
                  SEO Tags
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane card-body border fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div className="form-group mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleInput}
                    value={brandInput.name}
                    className="form-control"
                  />
                  <small className="text-danger">{error.name}</small>
                </div>
                <div className="form-group mb-3">
                  <label>Url</label>
                  <input
                    type="text"
                    name="url"
                    onChange={handleInput}
                    value={brandInput.url}
                    className="form-control"
                  />
                  <small className="text-danger">{error.url}</small>
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
                {/* <div className="form-group mb-3">
                  <label>Status</label>
                  <input
                    type="checkbox"
                    name="status"
                    onChange={handleInput}
                    value={brandInput.status}
                  />{' '}
                  Status 0=shown/1=hidden
                </div> */}
              </div>
              <div
                className="tab-pane card-body border fade"
                id="seo-tags"
                role="tabpanel"
                aria-labelledby="seo-tags-tab"
              >
                <div className="form-group mb-3">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    onChange={handleInput}
                    value={brandInput.meta_title}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Meta Keywords</label>
                  <textarea
                    name="meta_keyword"
                    onChange={handleInput}
                    value={brandInput.meta_keyword}
                    className="form-control"
                  ></textarea>
                </div>
                <div className="form-group mb-3">
                  <label>Meta Description</label>
                  <textarea
                    name="meta_descrip"
                    onChange={handleInput}
                    value={brandInput.meta_descrip}
                    className="form-control"
                  ></textarea>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary px-4 float-end mt-2"
            >
              Update
            </button>
          </form>
          <small className="text-danger">{error}</small>
        </div>
      </div>
    </div>
  );
}

export default EditBrand;
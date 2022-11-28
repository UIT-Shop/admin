import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { ProductType } from '../../common/constant/ProductType';

function EditCategory(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categoryInput, setCategory] = useState([]);
  const [error, setError] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`/Category/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setCategory(res.data.data);
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
          navigate('/admin/view-category');
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
          navigate('/admin/view-category');
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
    setCategory({ ...categoryInput, [e.target.name]: e.target.value });
  };

  const updateCategory = (e) => {
    e.preventDefault();

    // const category_id = props.match.params.id;
    // const data = categoryInput;
    axios
      .put(`/Category`, {
        id: id,
        name: categoryInput.name,
        url: categoryInput.url,
        gender: categoryInput.gender,
        type: categoryInput.type,
        meta_title: categoryInput.meta_title,
        meta_keyword: categoryInput.meta_keyword,
        meta_descrip: categoryInput.meta_descrip,
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
          navigate('/admin/view-category');
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  if (loading) {
    return <h4>Loading Edit Category...</h4>;
  }

  return (
    <div className="container px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Sửa phân loại
            <Link
              to="/admin/view-category"
              className="btn btn-primary  float-end"
            >
              Quay lại
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={updateCategory}>
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
                  Phân loại
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
                  Thẻ SEO
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
                  <label>Tên</label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleInput}
                    value={categoryInput.name}
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
                    value={categoryInput.url}
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
                      checked={categoryInput.gender === 'Nam'}
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
                      checked={categoryInput.gender === 'Nữ'}
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
                      checked={categoryInput.gender === 'Unisex'}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio3">
                      Unisex
                    </label>
                  </div>
                </div>
                <div className="form-group mb-4">
                  <label>Select Type</label>
                  <select
                    name="type"
                    onChange={handleInput}
                    value={categoryInput.type}
                    className="form-control"
                  >
                    <option>Select Type</option>
                    {ProductType.map((item, index) => {
                      return (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </div>
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
                    value={categoryInput.meta_title}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Meta Keywords</label>
                  <textarea
                    name="meta_keyword"
                    onChange={handleInput}
                    value={categoryInput.meta_keyword}
                    className="form-control"
                  ></textarea>
                </div>
                <div className="form-group mb-3">
                  <label>Meta Description</label>
                  <textarea
                    name="meta_descrip"
                    onChange={handleInput}
                    value={categoryInput.meta_descrip}
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

export default EditCategory;

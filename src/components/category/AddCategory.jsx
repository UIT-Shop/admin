import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { ProductType } from '../../common/constant/ProductType';

const AddCategory = () => {
  const [categoryInput, setCategory] = useState({
    name: '',
    url: '',
    gender: '',
    type: '',
    meta_title: '',
    meta_keyword: '',
    meta_descrip: '',
    error_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setCategory({ ...categoryInput, [e.target.name]: e.target.value });
  };

  const submitCategory = async (e) => {
    e.preventDefault();
    axios
      .post(`/Category`, {
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
          e.target.reset();
          toast.success('Thêm thành công', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          // document.getElementById('CATEGORY_FORM').reset();
        } else if (res.status === 400) {
          setCategory({ ...categoryInput, error_list: res.data.errors });
        }
      })
      .catch((err) => {
        setCategory({
          ...categoryInput,
          error_list: err.response.data.message,
        });
      });
  };

  var display_errors = [];
  if (categoryInput.error_list) {
    display_errors.push(categoryInput.error_list);
  }

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Add Category
            <Link
              to="/admin/view-category"
              className="btn btn-primary float-end"
            >
              View Category
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={submitCategory} id="CATEGORY_FORM">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="category-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#category"
                  type="button"
                  role="tab"
                  aria-controls="category"
                  aria-selected="true"
                >
                  Category
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
                id="category"
                role="tabpanel"
                aria-labelledby="category-tab"
              >
                <div className="form-group mb-4">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleInput}
                    value={categoryInput.name}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-4">
                  <label>Url</label>
                  <input
                    type="text"
                    name="url"
                    onChange={handleInput}
                    value={categoryInput.url}
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
                    {categoryInput.gender === 'Nữ' && (
                      <option value="Váy đầm">Váy đầm</option>
                    )}
                  </select>
                </div>
              </div>
              <div
                className="tab-pane card-body border fade"
                id="seo-tags"
                role="tabpanel"
                aria-labelledby="seo-tags-tab"
              >
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
                  <label>Meta Keywords</label>
                  <textarea
                    name="meta_keyword"
                    onChange={handleInput}
                    value={categoryInput.meta_keyword}
                    className="form-control"
                  ></textarea>
                </div>
                <div className="form-group mb-4">
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
              Submit
            </button>
          </form>
          {display_errors.map((item, idx) => {
            return (
              <small className="text-danger" key={idx}>
                {item}
              </small>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddCategory;

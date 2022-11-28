import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AddBrand = () => {
  const [brandInput, setBrand] = useState({
    name: '',
    url: '',
    meta_title: '',
    meta_keyword: '',
    meta_descrip: '',
    error_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setBrand({ ...brandInput, [e.target.name]: e.target.value });
  };

  const submitBrand = async (e) => {
    e.preventDefault();

    axios
      .post(`/Brand`, {
        name: brandInput.name,
        url: brandInput.url,
        meta_title: brandInput.meta_title,
        meta_keyword: brandInput.meta_keyword,
        meta_descrip: brandInput.meta_descrip,
      })
      .then((res) => {
        console.log(res);
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
          // document.getElementById('BRAND_FORM').reset();
        } else if (res.status === 400) {
          setBrand({ ...brandInput, error_list: res.data.errors });
        }
      })
      .catch((err) => {
        setBrand({
          ...brandInput,
          error_list: err.response.data.message,
        });
      });
  };

  var display_errors = [];
  if (brandInput.error_list) {
    display_errors.push(brandInput.error_list);
  }

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Add Brand
            <Link to="/admin/view-brand" className="btn btn-primary float-end">
              View Brand
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={submitBrand} id="BRAND_FORM">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="brand-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#brand"
                  type="button"
                  role="tab"
                  aria-controls="brand"
                  aria-selected="true"
                >
                  Brand
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
                id="brand"
                role="tabpanel"
                aria-labelledby="brand-tab"
              >
                <div className="form-group mb-4">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleInput}
                    value={brandInput.name}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-4">
                  <label>Url</label>
                  <input
                    type="text"
                    name="url"
                    onChange={handleInput}
                    value={brandInput.url}
                    className="form-control"
                  />
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
                    value={brandInput.meta_title}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-4">
                  <label>Meta Keywords</label>
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

export default AddBrand;

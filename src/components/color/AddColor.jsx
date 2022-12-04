import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const AddColor = () => {
  const [colorInput, setColor] = useState({
    id: '',
    name: '',
    error_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setColor({ ...colorInput, [e.target.name]: e.target.value });
  };

  const submitColor = async (e) => {
    e.preventDefault();

    axios
      .post(`/Color`, {
        id: colorInput.id,
        name: colorInput.name,
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
          // document.getElementById('BRAND_FORM').reset();
        } else if (res.status === 400) {
          setColor({ ...colorInput, error_list: res.data.errors });
        }
      })
      .catch((err) => {
        setColor({
          ...colorInput,
          error_list: err.response.data.message,
        });
      });
  };

  var display_errors = [];
  if (colorInput.error_list) {
    display_errors.push(colorInput.error_list);
  }

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Add Color
            <Link to="/admin/view-color" className="btn btn-primary float-end">
              View Color
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={submitColor} id="BRAND_FORM">
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane card-body border fade show active"
                id="color"
                role="tabpanel"
                aria-labelledby="color-tab"
              >
                <div className="form-group mb-4">
                  <label>Id</label>
                  <input
                    type="text"
                    name="id"
                    onChange={handleInput}
                    value={colorInput.id}
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-4">
                  <label>Tên</label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleInput}
                    value={colorInput.name}
                    className="form-control"
                  />
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

export default AddColor;

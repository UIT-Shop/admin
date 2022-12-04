import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function EditColor(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [colorInput, setColor] = useState([]);
  const [error, setError] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`/Color/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setColor(res.data.data);
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
          navigate('/admin/view-color');
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
          navigate('/admin/view-color');
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
    setColor({ ...colorInput, [e.target.name]: e.target.value });
  };

  const updateColor = (e) => {
    e.preventDefault();
    axios
      .put(`/Color`, {
        id: id,
        name: colorInput.name,
        url: colorInput.url,
        gender: colorInput.gender,
        meta_title: colorInput.meta_title,
        meta_keyword: colorInput.meta_keyword,
        meta_descrip: colorInput.meta_descrip,
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
          navigate('/admin/view-color');
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  if (loading) {
    return <h4>Loading Edit Color...</h4>;
  }

  return (
    <div className="container px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Edit Color
            <Link to="/admin/view-color" className="btn btn-primary  float-end">
              BACK
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={updateColor}>
            <div className="tab-content" id="myTabContent">
              <div className="form-group mb-4">
                <label>Id</label>
                <input
                  type="text"
                  name="id"
                  disabled={true}
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

export default EditColor;

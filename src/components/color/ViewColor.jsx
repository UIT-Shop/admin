import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function ViewColor() {
  const [loading, setLoading] = useState(true);
  const [colorlist, setColorlist] = useState([]);

  useEffect(() => {
    let isMounted = true;

    axios.get(`/Color`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setColorlist(res.data.data);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const deleteColor = (e, id) => {
    e.preventDefault();

    const thisClicked = e.currentTarget;
    thisClicked.innerText = 'Deleting';

    axios.delete(`/Color/${id}`).then((res) => {
      if (res.status === 200) {
        toast.success('Xóa thành công', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        thisClicked.closest('tr').remove();
      } else if (res.status === 404) {
        thisClicked.innerText = 'Delete';
      }
    });
  };

  var viewcolor_HTMLTABLE = '';
  if (loading) {
    return <h4>Loading Color...</h4>;
  } else {
    viewcolor_HTMLTABLE = colorlist.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>
            <Link
              to={`/admin/edit-color/${item.id}`}
              className="btn btn-success btn-sm"
            >
              Sửa
            </Link>
          </td>
          <td>
            <button
              type="button"
              onClick={(e) => deleteColor(e, item.id)}
              className="btn btn-danger btn-sm"
            >
              Xóa
            </button>
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Danh sách màu sắc
            <Link to="/admin/add-color" className="btn btn-primary float-end">
              Thêm màu
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Sửa</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>{viewcolor_HTMLTABLE}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewColor;

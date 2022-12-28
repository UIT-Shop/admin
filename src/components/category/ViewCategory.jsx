import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

function ViewCategory() {
  const [loading, setLoading] = useState(true);
  const [categorylist, setCategorylist] = useState([]);

  useEffect(() => {
    let isMounted = true;

    axios.get(`/Category`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setCategorylist(res.data.data);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const deleteCategory = (e, id) => {
    e.preventDefault();

    const thisClicked = e.currentTarget;
    thisClicked.innerText = 'Deleting';

    axios.delete(`/Category/${id}`).then((res) => {
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

  var viewcategory_HTMLTABLE = '';
  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>;
  } else {
    viewcategory_HTMLTABLE = categorylist.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.gender}</td>
          <td>{item.type}</td>
          {/* <td>{item.url}</td> */}
          <td>
            <Link
              to={`/admin/edit-category/${item.id}`}
              className="btn btn-success btn-sm"
            >
              Sửa
            </Link>
          </td>
          <td>
            <button
              type="button"
              onClick={(e) => deleteCategory(e, item.id)}
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
            Danh sách phân loại
            <Link
              to="/admin/add-category"
              className="btn btn-primary float-end"
            >
              Thêm phân loại
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Giới tính</th>
                <th>Loại</th>
                {/* <th>Url</th> */}
                <th>Sửa</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>{viewcategory_HTMLTABLE}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewCategory;

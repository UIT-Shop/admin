import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Role } from '../../common/constant/Role';
import jwt from 'jwt-decode';

function ViewUsers() {
  const [loading, setLoading] = useState(true);
  const [userlist, setUserlist] = useState([]);
  const [id, setUserid] = useState();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user = jwt(token);
    let isMounted = true;

    axios.get(`/User`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setUserlist(res.data.data);
          setLoading(false);
        }
      }
    });

    setUserid(user[Object.keys(user)[0]]);

    return () => {
      isMounted = false;
    };
  }, []);

  const deleteUser = (e, id) => {
    e.preventDefault();

    const thisClicked = e.currentTarget;
    thisClicked.innerText = 'Đang xóa';

    axios.delete(`/User/${id}`).then((res) => {
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
        thisClicked.innerText = 'Xóa';
      }
    });
  };

  const changeRole = (e, userId, index) => {
    axios
      .put(`/User/${userId}/role/${e.target.checked ? 'Admin' : 'Customer'}`)
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

          const list = [...userlist];
          list[index].role = e.target.checked;
          setUserlist(list);
        }
      });
  };
  var viewuser_HTMLTABLE = '';
  if (loading) {
    return <h4>Loading User...</h4>;
  } else {
    viewuser_HTMLTABLE = userlist.map((item, idx) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td>{item.role ? Role.Ad : Role.Cus}</td>
          <td>
            {item.id != id && (
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  value={item.role}
                  defaultChecked={item.role}
                  onChange={(e) => changeRole(e, item.id, idx)}
                />
              </div>
            )}
          </td>
          <td>
            {item.id != id && (
              <button
                type="button"
                onClick={(e) => deleteUser(e, item.id)}
                className="btn btn-danger btn-sm"
              >
                Xóa
              </button>
            )}
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
          <h4>Danh sách người dùng</h4>
        </div>
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Đổi vai trò</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>{viewuser_HTMLTABLE}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewUsers;

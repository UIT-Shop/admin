import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MasterLayout from './layouts/MasterLayout';
import { ToastContainer, toast } from 'react-toastify';

const AdminPrivateRoute = ({ ...rest }) => {
  const navigate = useNavigate();

  const [Authenticated, setAuthenticated] = useState(false);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    axios.get(`/Auth/check-authen`).then((res) => {
      if (res.status === 200) {
        setAuthenticated(true);
      }
      setloading(false);
    });

    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error.response.status === 403) {
          // Access Denied
          toast.warning('Bạn không có quyền truy cập trang này', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          navigate('/403');
        } else if (error.response.status === 404) {
          //Page Not Found
          toast.warning('Trang không tồn tại', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
          navigate('/404');
        }
        return Promise.reject(error);
      },
    );
    return () => {
      setAuthenticated(false);
    };
  }, []);
  axios.interceptors.response.use(
    undefined,
    function axiosRetryInterceptor(err) {
      if (err.response.status === 401) {
        toast.warning('Vui lòng đăng nhập', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        navigate('/login');
      }
      return Promise.reject(err);
    },
  );
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Routes>
        <Route
          {...rest}
          path="/*"
          name="Admin"
          element={
            Authenticated ? (
              <MasterLayout />
            ) : (
              <Navigate to={{ pathname: '/login' }} />
            )
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default AdminPrivateRoute;

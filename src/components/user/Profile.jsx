import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import jwt from 'jwt-decode';
import { Role } from '../../common/constant/Role';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 1,
    address: {},
  });

  // const [detailAddress, setDetailAddress] = useState({
  //   fullAddress:'',
  // });

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('auth_token');
    const user = jwt(token);
    const useId = user[Object.keys(user)[0]];

    axios.get(`/user/info/${useId}`).then((res) => {
      if (isMounted) {
        console.log(res.data.data);

        // setDetailAddress(res.data.data.address);
        setUser(res.data.data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page-content page-container" id="page-content">
      <div className="p-5">
        <div className="row container d-flex justify-content-center">
          <div className="col-12 col-md-8">
            <div className="card user-card-full">
              <div className="row mx-0">
                <div className="col-sm-4 bg-c-lite-green user-profile">
                  <div className="card-block text-center text-white">
                    <div className="mb-4">
                      <img
                        src="https://img.icons8.com/bubbles/100/000000/user.png"
                        className="img-radius"
                        alt="User-Profile-Image"
                      />
                    </div>
                    <h6 className="f-w-600">{user.name}</h6>
                    <p>{user.role ? Role.Ad : Role.Cus}</p>
                    <div className="d-flex justify-content-center">
                      <Link
                        to="/admin/profile/edit"
                        className="btn btn-primary"
                      >
                        <div>
                          <i className="fas fa-pen-to-square"></i>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block">
                    <h6 className="mb-2 pb-1 b-b-default f-w-600">Thông tin</h6>
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <p className="mb-2 f-w-600">Email</p>
                        <h6 className="text-muted f-w-400">{user.email}</h6>
                      </div>
                      <div className="col-12 col-md-6">
                        <p className="mb-2 f-w-600">Số điện thoại</p>
                        <h6 className="text-muted f-w-400">{user.phone}</h6>
                      </div>
                    </div>
                    <h6 className="mb-2 m-t-40 pb-1 b-b-default f-w-600">
                      Địa chỉ
                    </h6>
                    <h6 className="text-muted f-w-400">
                      {user.address ? user.address.fullAddress : null}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, navigate, useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';
import { Role } from '../../common/constant/Role';
import './Profile.css';

const EditProfile = () => {
  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);

  const [idProvince, setIdProvince] = useState('');
  const [idDistrict, setIdDistrict] = useState('');
  const [idWard, setIdWard] = useState('');
  const [styleProvince, setStyleProvince] = useState('option_disable');
  const [styleDis, setStyleDis] = useState('option_disable');
  const [styleWard, setStyleWard] = useState('option_disable');

  const [address, setAddress] = useState({
    province: '',
    district: '',
    ward: '',
    note: '',
  });

  const navigate = useNavigate();

  //   const [detailAddress, setDetailAddress] = useState('');

  const handleFetchProvince = async () => {
    if (province.length === 0) {
      const response = await axios.get(`/address/provinces`);
      setProvince(response.data.data);
    }
  };

  const handleFetchDistrict = async (oldProvinceId = null) => {
    let response;
    if (oldProvinceId)
      response = await axios.get(
        `/address/provinces/${oldProvinceId}/districts`,
      );
    else
      response = await axios.get(`/address/provinces/${idProvince}/districts`);
    setDistrict(response.data.data);
  };

  useEffect(() => {
    if (idDistrict !== '') {
      setAddress({
        ...address,
        ward: '',
        note: '',
      });
      document.querySelector('.wardSelect').value = '';
      setStyleWard('option_disable');
      handleFetchWard();
    }
  }, [idDistrict]);

  const handleFetchWard = async (
    oldDistrictId = null,
    oldProvinceId = null,
  ) => {
    let response;
    if (oldProvinceId && oldDistrictId) {
      response = await axios.get(
        `/address/provinces/${oldProvinceId}/districts/${oldProvinceId}/wards`,
      );
      setWard(response.data.data);
    } else if (idDistrict !== '') {
      response = await axios.get(
        `/address/provinces/${idProvince}/districts/${idDistrict}/wards`,
      );
      setWard(response.data.data);
    }
  };

  const handleGetNameProvince = (id) => {
    if (id !== '') {
      const citySelected = province.find((item) => item.id == id);
      return citySelected.name;
    }
  };

  const handleGetNameDistrict = (id) => {
    if (id !== '') {
      const districtSelected = district.find((item) => item.id == id);
      return districtSelected.name;
    }
  };

  const handleGetNameWard = (id) => {
    if (id !== '') {
      const wardSelected = ward.find((item) => item.id == id);
      return wardSelected.name;
    }
  };

  const handleGetNameNote = (detail) => {
    setAddress({
      ...address,
      note: detail,
    });
  };
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 1,
    address: {
      wardId: '',
      street: '',
      ward: {
        districtId: '',
        provinceId: '',
      },
    },
  });

  const [detailAddress, setDetailAddress] = useState('');

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('auth_token');
    const user = jwt(token);
    const useId = user[Object.keys(user)[0]];

    axios.get(`/user/info/${useId}`).then(async (res) => {
      if (isMounted) {
        console.log(res.data.data);

        setDetailAddress(res.data.data.address);
        setUser(res.data.data);
        if (res.data.data.address) {
          const oldAddress = res.data.data.address;
          await handleFetchProvince();
          await handleFetchDistrict(oldAddress.ward.provinceId);
          await handleFetchWard(
            oldAddress.ward.districtId,
            oldAddress.ward.provinceId,
          );

          console.log('oldProvinceId', oldAddress.ward.districtId);
          setIdProvince(oldAddress.ward.provinceId);
          setIdDistrict(oldAddress.ward.districtId);
          setIdWard(oldAddress.wardId);
          setAddress({
            ...address,
            note: oldAddress.street,
          });
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleInput = (e) => {
    e.persist();
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    user.address = { wardId: idWard, street: address.note };
    console.log('user', user);
    axios.put(`/user`, user).then((res) => {
      navigate('/admin/profile');
    });
  };

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
                  </div>
                </div>
                <div className="col-sm-8">
                  <div className="card-block">
                    <h6 className="mb-2 pb-1 b-b-default f-w-600">Thông tin</h6>
                    <div className="row mb-2">
                      <div className="col-12 col-md-6">
                        <label className="labels">Tên</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Tên người dùng"
                          value={user.name}
                          onChange={handleInput}
                          name="name"
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="labels">Số điện thoại</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Số điện thoại"
                          name="phone"
                          onChange={handleInput}
                          value={user.phone}
                        />
                      </div>
                    </div>
                    <h6 className="mb-2 m-t-40 pb-1 b-b-default f-w-600">
                      Địa chỉ
                    </h6>
                    <div className="row mb-2">
                      <div className="col-12 col-md-6">
                        <lable>Tỉnh/Thành phố</lable>
                        <div className="select__items">
                          <select
                            className={`${styleProvince} form-control`}
                            onClick={() => {
                              handleFetchProvince();
                            }}
                            onChange={(e) => {
                              setIdProvince(e.target.value);

                              setAddress({
                                province: handleGetNameProvince(e.target.value),
                                district: '',
                                ward: '',
                                note: '',
                              });
                              if (e.target.value == '') {
                                setStyleProvince('option_disable');
                              } else {
                                setStyleProvince('option_able');
                              }
                            }}
                            value={idProvince}
                          >
                            <option value="" className="option_disable">
                              Chọn tỉnh/thành phố
                            </option>

                            {province &&
                              province.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <lable>Quận/Huyện</lable>
                        <div className="select__items">
                          <select
                            className={`${styleDis} districtSelect form-control`}
                            onClick={() => {
                              handleFetchDistrict();
                            }}
                            onChange={(e) => {
                              setIdDistrict(e.target.value);
                              setAddress({
                                ...address,
                                district: handleGetNameDistrict(e.target.value),
                                ward: '',
                              });
                              if (e.target.value == '') {
                                setStyleDis('option_disable');
                              } else {
                                setStyleDis('option_able');
                              }
                            }}
                            value={idDistrict}
                          >
                            <option value="" className="option_disable">
                              Chọn quận/huyện
                            </option>

                            {district &&
                              district.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <lable>Phường xã</lable>
                        <div className="select__items">
                          <select
                            className={`${styleWard} wardSelect form-control`}
                            onClick={() => {
                              handleFetchWard();
                            }}
                            onChange={(e) => {
                              handleFetchWard();
                              setAddress({
                                ...address,
                                ward: handleGetNameWard(e.target.value),
                              });
                              setIdWard(e.target.value);

                              if (e.target.value == '') {
                                setStyleWard('option_disable');
                              } else {
                                setStyleWard('option_able');
                              }
                            }}
                            value={idWard}
                          >
                            <option value="" className="option_disable">
                              Chọn phường/xã
                            </option>

                            {ward &&
                              ward.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.name}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      </div>
                      <div className="col-12 ">
                        <lable className="labels">Đường phố</lable>
                        <input
                          type="text"
                          placeholder="Nhập đường phố"
                          className="form-control"
                          onChange={(e) => {
                            handleGetNameNote(e.target.value);
                          }}
                          value={address.note}
                        />
                      </div>
                    </div>
                    <div class="d-flex justify-content-around mt-2">
                      <Link to="/admin/profile" className="btn btn-primary">
                        <div>Quay lại</div>
                      </Link>
                      <button
                        className="btn btn-primary "
                        onClick={saveProfile}
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="basic_info">
      <h1>THÔNG TIN CƠ BẢN</h1>
      <div className="select_container">
        <div className="left">
          <p>
            Tỉnh/Thành phố <span className="text-danger">*</span>
          </p>
          <div className="select__items">
            <select
              className={`${styleProvince}`}
              onClick={() => {
                handleFetchProvince();
              }}
              onChange={(e) => {
                setIdProvince(e.target.value);

                setAddress({
                  province: handleGetNameProvince(e.target.value),
                  district: '',
                  ward: '',
                  note: '',
                  project: '',
                });
                if (e.target.value == '') {
                  setStyleProvince('option_disable');
                } else {
                  setStyleProvince('option_able');
                }
              }}
            >
              <option value="" className="option_disable">
                Chọn tỉnh/thành phố
              </option>

              {province &&
                province.map((item) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
            {/* <img className="icon_down" src={arrowDown} alt="arrowDown" /> */}
          </div>
          {/* <p className={errors.province_Id?.message ? 'active' : 'non-active'}>
            {errors.province_Id?.message}
          </p> */}
        </div>
        <div className="right">
          <p>
            Quận/Huyện <span className="text-danger">*</span>
          </p>
          <div className="select__items">
            <select
              className={`${styleDis} districtSelect`}
              onClick={() => {
                handleFetchDistrict();
              }}
              onChange={(e) => {
                setIdDistrict(e.target.value);
                setAddress({
                  ...address,
                  district: handleGetNameDistrict(e.target.value),
                  ward: '',
                });
                if (e.target.value == '') {
                  setStyleDis('option_disable');
                } else {
                  setStyleDis('option_able');
                }
              }}
            >
              <option value="" className="option_disable">
                Chọn quận/huyện
              </option>

              {district &&
                district.map((item) => {
                  return (
                    <option key={item.id} value={`${item.id}`}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
            {/* <img className="icon_down" src={arrowDown} alt="arrowDown" /> */}
          </div>
          {/* <p className={errors.district_Id?.message ? 'active' : 'non-active'}>
            {errors.district_Id?.message}
          </p> */}
        </div>
      </div>
      {idDistrict !== '' ? (
        <div className="select_container">
          <div className="left">
            <p>
              Phường xã <span className="text-danger">*</span>
            </p>
            <div className="select__items">
              <select
                className={`${styleWard} wardSelect`}
                onClick={() => {
                  handleFetchWard();
                }}
                onChange={(e) => {
                  handleFetchWard();
                  setAddress({
                    ...address,
                    ward: handleGetNameWard(e.target.value),
                  });
                  setIdWard(e.target.value);

                  if (e.target.value == '') {
                    setStyleWard('option_disable');
                  } else {
                    setStyleWard('option_able');
                  }
                }}
              >
                <option value="" className="option_disable">
                  Chọn phường/xã
                </option>

                {ward &&
                  ward.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
              {/* <img className="icon_down" src={arrowDown} alt="arrowDown" /> */}
            </div>
            {/* <p className={errors.ward_Id?.message ? 'active' : 'non-active'}>
              {errors.ward_Id?.message}
            </p> */}
          </div>
          <div className="right">
            <p>
              Đường phố <span className="text-danger">*</span>
            </p>
            <input
              type="text"
              placeholder="Nhập đường phố"
              className="input_items"
              onChange={(e) => {
                handleGetNameNote(e.target.value);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="select_container">
          <div className="left">
            <p>
              Phường xã <span className="text-danger">*</span>
            </p>
            <div className="select__items">
              <select className="option_disable wardSelect">
                <option value="" className="option_disable">
                  Chọn phường/xã
                </option>
              </select>
              {/* <img className="icon_down" src={arrowDown} alt="arrowDown" /> */}
            </div>
            {/* <p className={errors.ward_Id?.message ? 'active' : 'non-active'}>
              {errors.ward_Id?.message}
            </p> */}
          </div>
          <div className="right">
            <p>
              Đường phố <span className="text-danger">*</span>
            </p>
            <input
              type="text"
              placeholder="Chọn đường phố"
              className="input_items"
              onChange={(e) => {
                handleGetNameNote(e.target.value);
              }}
            />
          </div>
        </div>
      )}
      <div className="select_container">
        <p>
          Địa chỉ <span className="text-danger">*</span>
        </p>
        <input
          disabled
          type="text"
          placeholder="Tên dự án + Quận/Huyện + Tỉnh/Thành phố"
          className="input_title"
          value={detailAddress}
        />
        {/* <p className={errors.address?.message ? 'active' : 'non-active'}>
          {errors.address?.message}
        </p> */}
      </div>
    </div>
  );
};

export default EditProfile;

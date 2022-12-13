import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
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

  useEffect(() => {
    setStyleDis('option_disable');
    setStyleWard('option_disable');
    setIdDistrict('');
    document.querySelector('.districtSelect').value = '';
    document.querySelector('.wardSelect').value = '';
  }, [idProvince]);

  const [detailAddress, setDetailAddress] = useState('');

  useEffect(() => {
    const { province, district, ward, note } = address;
    const haveNote = note ? `${note}, ` : '';
    const haveWard = ward ? `${ward}, ` : '';
    const haveDistrict = district ? `${district}, ` : '';
    const haveProvince = province ? `${province}.` : '';

    let detail = `${haveNote}${haveWard}${haveDistrict}${haveProvince}`;

    setDetailAddress(detail);
  }, [address]);

  useEffect(() => {
    setAddress({ ...address, ward: '', note: '', project: '' });
  }, []);

  useEffect(() => {}, [idWard]);

  const handleFetchProvince = async () => {
    if (province.length === 0) {
      const response = await axios.get(`/address/provinces`);
      setProvince(response.data.data);
    }
  };

  const handleFetchDistrict = async () => {
    const response = await axios.get(
      `/address/provinces/${idProvince}/districts`,
    );
    setDistrict(response.data.data);
  };

  useEffect(() => {
    if (idDistrict !== '') {
      setAddress({
        ...address,
        ward: '',
        note: '',
        project: '',
      });
      document.querySelector('.wardSelect').value = '';
      setStyleWard('option_disable');
      handleFetchWard();
    }
  }, [idDistrict]);

  const handleFetchWard = async () => {
    if (idDistrict !== '') {
      const response = await axios.get(
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

  return (
    <div className="basic_info">
      <h1>THÔNG TIN CƠ BẢN</h1>
      <div className="select_container">
        <div className="left">
          <p>
            Tỉnh/Thành phố <span>*</span>
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
            Quận/Huyện <span>*</span>
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
              Phường xã <span>*</span>
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
              Đường phố <span>*</span>
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
              Phường xã <span>*</span>
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
              Đường phố <span>*</span>
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
          Địa chỉ <span>*</span>
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

export default Profile;

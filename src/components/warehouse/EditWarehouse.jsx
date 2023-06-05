import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

function EditWarehouse(props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [warehouseInput, setWarehouse] = useState([])
  const [error, setError] = useState([])
  const [currentTab, setCurrentTab] = useState(0)
  const { id } = useParams()
  const [province, setProvince] = useState([])
  const [district, setDistrict] = useState([])
  const [ward, setWard] = useState([])

  const [idProvince, setIdProvince] = useState('')
  const [idDistrict, setIdDistrict] = useState('')
  const [idWard, setIdWard] = useState('')
  const [styleProvince, setStyleProvince] = useState('option_disable')
  const [styleDis, setStyleDis] = useState('option_disable')
  const [styleWard, setStyleWard] = useState('option_disable')

  const [address, setAddress] = useState({
    province: '',
    district: '',
    ward: '',
    note: ''
  })

  const handleFetchProvince = async () => {
    if (province.length === 0) {
      const response = await axios.get(`/address/provinces`)
      setProvince(response.data.data)
    }
  }

  const handleFetchDistrict = async (oldProvinceId = null) => {
    let response = null
    if (oldProvinceId) response = await axios.get(`/address/provinces/${oldProvinceId}/districts`)
    else if (idProvince !== '') {
      response = await axios.get(`/address/provinces/${idProvince}/districts`)
      setDistrict(response.data.data)
    } else setDistrict(response)
  }

  useEffect(() => {
    if (idDistrict !== '') {
      setAddress({
        ...address,
        ward: '',
        note: ''
      })
      document.querySelector('.wardSelect').value = ''
      setStyleWard('option_disable')
      handleFetchWard()
    }
  }, [idDistrict])

  const handleFetchWard = async (oldDistrictId = null, oldProvinceId = null) => {
    let response = null
    if (oldProvinceId && oldDistrictId) {
      response = await axios.get(
        `/address/provinces/${oldProvinceId}/districts/${oldProvinceId}/wards`
      )
      setWard(response.data.data)
    } else if (idDistrict !== '' && idProvince !== '') {
      response = await axios.get(`/address/provinces/${idProvince}/districts/${idDistrict}/wards`)
      setWard(response.data.data)
    } else setWard(response)
  }

  const handleGetNameProvince = (id) => {
    if (id !== '') {
      const citySelected = province.find((item) => item.id == id)
      return citySelected.name
    }
  }

  const handleGetNameDistrict = (id) => {
    if (id !== '') {
      const districtSelected = district.find((item) => item.id == id)
      return districtSelected.name
    }
  }

  const handleGetNameWard = (id) => {
    if (id !== '') {
      const wardSelected = ward.find((item) => item.id == id)
      return wardSelected.name
    }
  }

  const handleGetNameNote = (detail) => {
    setAddress({
      ...address,
      note: detail
    })
  }

  useEffect(() => {
    axios
      .get(`/Warehouse/${id}`)
      .then(async (res) => {
        if (res.status === 200) {
          setWarehouse(res.data.data)
          if (res.data.data.address) {
            const oldAddress = res.data.data.address
            await handleFetchProvince()
            await handleFetchDistrict(oldAddress.ward.provinceId)
            await handleFetchWard(oldAddress.ward.districtId, oldAddress.ward.provinceId)

            setIdProvince(oldAddress.ward.provinceId)
            setIdDistrict(oldAddress.ward.districtId)
            setIdWard(oldAddress.wardId)
            setAddress({
              ...address,
              note: oldAddress.street
            })
          }
        } else if (res.status === 400) {
          toast.error('Lỗi lấy dữ liệu', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          })
          navigate('/admin/view-warehouse')
        }
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
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
            theme: 'colored'
          })
          navigate('/admin/view-warehouse')
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
            theme: 'colored'
          })
        } else {
          // Anything else
          console.log('Error', err.message)
        }
      })
  }, [id])

  const handleInput = (e) => {
    e.persist()
    setWarehouse({ ...warehouseInput, [e.target.name]: e.target.value })
  }
  const next = (e) => {
    e.preventDefault()
    setCurrentTab((prev) => parseInt(prev) + 1)
  }
  const prev = (e) => {
    e.preventDefault()
    setCurrentTab((prev) => parseInt(prev) - 1)
  }
  const updateWarehouse = (e) => {
    e.preventDefault()
    warehouseInput.address = { wardId: idWard, street: address.note }
    axios
      .put(`/Warehouse`, warehouseInput)
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
            theme: 'colored'
          })
          navigate('/admin/view-warehouse')
        }
      })
      .catch((err) => {
        setError(err.response.data.message)
      })
  }

  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>
  }

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Sửa kho
            <Link to="/admin/view-warehouse" className="btn btn-primary float-end">
              Xem kho
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={updateWarehouse} encType="multipart/form-data">
            <div
              className="tab-pane card-body border fade show active"
              id="warehouse"
              role="tabpanel"
              aria-labelledby="warehouse-tab">
              <div className="row ">
                <div className="col-md-6 form-group mb-4">
                  <label>Tên kho</label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleInput}
                    value={warehouseInput.name}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6 form-group mb-4">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    onChange={handleInput}
                    value={warehouseInput.phone}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group mb-4"></div>

              <h6 className="mb-2 m-t-40 pb-1 b-b-default f-w-600">Địa chỉ</h6>
              <div className="row mb-2">
                <div className="col-12 col-md-6">
                  <lable>Tỉnh/Thành phố</lable>
                  <div className="select__items">
                    <select
                      className={`${styleProvince} form-control`}
                      onClick={() => {
                        handleFetchProvince()
                      }}
                      onChange={(e) => {
                        setIdProvince(e.target.value)

                        setAddress({
                          province: handleGetNameProvince(e.target.value),
                          district: '',
                          ward: '',
                          note: ''
                        })
                        if (e.target.value == '') {
                          setStyleProvince('option_disable')
                        } else {
                          setStyleProvince('option_able')
                        }
                      }}
                      value={idProvince}>
                      <option value="" className="option_disable">
                        Chọn tỉnh/thành phố
                      </option>

                      {province &&
                        province.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          )
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
                        handleFetchDistrict()
                      }}
                      onChange={(e) => {
                        setIdDistrict(e.target.value)
                        setAddress({
                          ...address,
                          district: handleGetNameDistrict(e.target.value),
                          ward: ''
                        })
                        if (e.target.value == '') {
                          setStyleDis('option_disable')
                        } else {
                          setStyleDis('option_able')
                        }
                      }}
                      value={idDistrict}>
                      <option value="" className="option_disable">
                        Chọn quận/huyện
                      </option>

                      {district &&
                        district.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          )
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
                        handleFetchWard()
                      }}
                      onChange={(e) => {
                        handleFetchWard()
                        setAddress({
                          ...address,
                          ward: handleGetNameWard(e.target.value)
                        })
                        setIdWard(e.target.value)

                        if (e.target.value == '') {
                          setStyleWard('option_disable')
                        } else {
                          setStyleWard('option_able')
                        }
                      }}
                      value={idWard}>
                      <option value="" className="option_disable">
                        Chọn phường/xã
                      </option>

                      {ward &&
                        ward.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          )
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
                      handleGetNameNote(e.target.value)
                    }}
                    value={address.note}
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary px-4 mt-4 float-end">
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditWarehouse

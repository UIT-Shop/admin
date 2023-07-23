import axios from 'axios'
import vi from 'date-fns/locale/vi'
import Moment from 'moment'
import React, { useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import Variant from './Variant'

import 'react-datepicker/dist/react-datepicker.css'
import './react-datepicker.css'

function MoveProductToWarehouse() {
  registerLocale('vi', vi)

  const [warehouseList, setWarehouseList] = useState([])
  const [dateInput, setDateInput] = useState(new Date())

  const [productStoreInput, setProductStore] = useState({
    warehouse_from_id: '',
    warehouse_to_id: ''
  })
  const [errorlist, setError] = useState([])
  const [variantList, setVariantList] = useState([
    {
      productId: '',
      productName: '',
      colorList: [],
      colorId: '',
      price: '',
      size: '',
      quantity: '',
      lotCode: '',
      note: ''
    }
  ])

  useEffect(() => {
    let isMounted = true

    axios.get(`/Warehouse`).then((res) => {
      if (isMounted)
        if (res.status === 200) {
          setWarehouseList(res.data.data)
        }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const handleInput = (e) => {
    e.persist()
    setProductStore({ ...productStoreInput, [e.target.name]: e.target.value })
  }

  const validate = () => {
    if (
      productStoreInput.warehouse_from_id.trim() === '' ||
      productStoreInput.warehouse_to_id.trim() === '' ||
      !Moment(dateInput).isValid()
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
      return false
    }
    if (productStoreInput.warehouse_from_id.trim() === productStoreInput.warehouse_to_id.trim()) {
      toast.error('Kho nhập và xuất phải khác nhau', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
      return false
    }
    let checkVariant = true
    variantList.map((variant) => {
      if (variant.productId.trim() !== '') {
        if (variant.quantity === '' || parseInt(variant.quantity) === 0) {
          toast.error('Số lượng phải khác 0', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored'
          })
          checkVariant = false
        }
      }
    })
    return checkVariant
  }

  const submitProductStore = (e) => {
    e.preventDefault()
    if (!validate()) {
      return
    }
    for (let variant of variantList) {
      if (variant.productId.trim() !== '')
        axios
          .put(`/ProductVariant/Store`, {
            warehouseFromId: productStoreInput.warehouse_from_id,
            warehouseId: productStoreInput.warehouse_to_id,
            productId: variant.productId,
            colorId: variant.colorId,
            size: variant.size,
            quantity: variant.quantity,
            buyPrice: variant.price,
            dateInput: dateInput,
            lotCode: variant.lotCode,
            note: variant.note
          })
          .catch((err) => {
            toast.error(err.response.message, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
            return
          })
    }
    toast.success('Chỉnh sửa thành công', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    })
    setProductStore({
      ...productStoreInput,
      warehouse_id: ''
    })
  }

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Di chuyển sản phẩm vào kho
            <Link to="/admin/view-product?page=1" className="btn btn-primary float-end">
              Xem sản phẩm
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={submitProductStore} encType="multipart/form-data">
            <div className="row">
              <div className="col-md-4 form-group mb-4">
                <label>Kho xuất</label>
                <select
                  name="warehouse_from_id"
                  onChange={handleInput}
                  value={productStoreInput.warehouse_from_id}
                  className="form-control">
                  <option>Chọn kho</option>
                  {warehouseList.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <small className="text-danger">{errorlist.warehouse_from_id}</small>
              </div>
              <div className="col-md-4 form-group mb-4">
                <label>Kho nhập</label>
                <select
                  name="warehouse_to_id"
                  onChange={handleInput}
                  value={productStoreInput.warehouse_to_id}
                  className="form-control">
                  <option>Chọn kho</option>
                  {warehouseList.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <small className="text-danger">{errorlist.warehouse_to_id}</small>
              </div>

              <div className="col-md-4 form-group mb-4">
                <label>Ngày di chuyển</label>
                <div />
                <DatePicker
                  locale={'vi'}
                  selected={dateInput}
                  dateFormat={'dd/MM/yyyy'}
                  onChange={(date) => setDateInput(date)}
                />
                <small className="text-danger">{errorlist.brand}</small>
              </div>
            </div>

            <Variant
              variantList={variantList}
              setVariantList={setVariantList}
              dateInput={dateInput}
              isAdd={false}
            />
            <button type="submit" className="btn btn-primary px-4 float-end">
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default MoveProductToWarehouse

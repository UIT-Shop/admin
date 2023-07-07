import axios from 'axios'
import Moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { OrderStatus } from '../../common/constant/OrderStatus'

function OrderDetail() {
  const [loading, setLoading] = useState(true)
  const [orderDetail, setOrderDetail] = useState([])
  const [order, setOrder] = useState()
  const [status, setStatus] = useState('')
  const { id } = useParams()
  useEffect(() => {
    let isMounted = true
    axios.get(`/Order/${id}`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          console.log(OrderStatus[res.data.data.status])
          setOrderDetail(res.data.data.products)
          setOrder(res.data.data)
          setStatus(OrderStatus[res.data.data.status].key)
          setLoading(false)
        }
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const handleStatus = (e) => setStatus(e.target.value)
  const submit = () => {
    axios.put(`/Order/${id}/${status}`).then((res) => {
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
      }
    })
  }
  var display_order = ''
  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>
  } else {
    display_order = orderDetail.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.title}</td>
          <td>{item.productSize}</td>
          <td>{item.productColor}</td>
          <td>{item.quantity}</td>
          <td>
            <img src={item.imageUrl} width="50px" alt={item.title} />
          </td>
          <td>
            {Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(item.totalPrice)}
          </td>
        </tr>
      )
    })
  }

  return (
    <div className="container px-4 mt-3">
      <div className="card">
        <div className="card-header">
          <ToastContainer />
          <h4>Chi tiết đơn hàng</h4>
        </div>
        <div className="card-body">
          <main>
            <div className="row contacts">
              <lable className="text-gray-light">
                <strong>Thông tin đơn hàng:</strong>
              </lable>
              <div className="col ">
                <div className="to">
                  <strong>Người đặt: </strong>
                  {order.user.name}
                </div>

                <div className="address">
                  <strong>Địa chỉ: </strong>
                  {order.address.fullAddress}
                </div>
                <div className="email">
                  <div>
                    <strong>Email: </strong>
                    {order.user.email}
                  </div>
                </div>
              </div>
              <div className="col text-end">
                <div className="date">
                  <strong>Ngày đặt: </strong>

                  {Moment(order.orderDate).format('HH:mm:ss - DD/MM/yyyy')}
                </div>
                <div>
                  <strong>Tổng tiền: </strong>

                  {Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(order.totalPrice)}
                </div>
              </div>
            </div>
          </main>
          <hr />
          <lable className="text-gray-light">
            <strong>Danh sách sản phẩm: </strong>
          </lable>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Kích cỡ</th>
                  <th>Màu sắc</th>
                  <th>Số lượng</th>
                  <th>Ảnh</th>
                  <th>Tổng tiền</th>
                </tr>
              </thead>
              <tbody>{display_order}</tbody>
            </table>
          </div>

          <div className="row">
            <div className="col text-end">
              <strong>Trạng thái đơn hàng: </strong>
            </div>
            <div className="col ">
              <select name="status" onChange={handleStatus} value={status} className="form-control">
                {OrderStatus.map((item) => {
                  var index = OrderStatus.findIndex((o) => o.key === status)
                  var indexDEL = 3
                  if (index <= indexDEL)
                    return (
                      <option value={item.key} key={item.key}>
                        {item.value}
                      </option>
                    )
                })}
              </select>
            </div>
          </div>
          <button onClick={submit} className="btn btn-primary px-4 float-end mt-2">
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail

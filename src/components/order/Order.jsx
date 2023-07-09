import axios from 'axios'
import vi from 'date-fns/locale/vi'
import Moment from 'moment'
import React, { useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import ReactPaginate from 'react-paginate'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { OrderStatus } from '../../common/constant/OrderStatus'

function Order() {
  const navigate = useNavigate()
  registerLocale('vi', vi)

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [status, setStatus] = useState(1)
  const [dateInput, setDateInput] = useState(new Date())

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setCurrentPage(searchParams.get('page'))
    setStatus(searchParams.get('status'))
    var date = new Date(searchParams.get('date') + '-15')

    if (!Moment(date).isValid()) return
    let date_tmp = Moment(date).format('yyyy-MM-15 00:00:00')
    var url = `/Order/admin?page=${parseInt(searchParams.get('page'))}
    &status=${parseInt(searchParams.get('status'))}
    &monthYear=${date_tmp}`
    axios.get(url).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setOrders(res.data.data.orderOverviews)
          setPageCount(res.data.data.pages)
          setLoading(false)
        }
      }
    })
    return () => {
      isMounted = false
    }
  }, [currentPage])

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    event.preventDefault()
    var page = parseInt(event.selected) + 1
    setCurrentPage(parseInt(event.selected))
    window.scrollTo(0, 0)
    var dateFormat = Moment(dateInput).format('yyyy-MM')
    navigate({
      pathname: '/admin/orders',
      search: `?page=${page}&status=${status}&date=${dateFormat}`
    })
  }

  const handleStatusClick = (event) => {
    event.preventDefault()
    var page = 1
    setCurrentPage(0)
    var status = OrderStatus.findIndex((o) => o.key === event.target.id)
    window.scrollTo(0, 0)
    var dateFormat = Moment(dateInput).format('yyyy-MM')
    navigate({
      pathname: '/admin/orders',
      search: `?page=${page}&status=${status}&date=${dateFormat}`
    })
  }

  const handleDateChange = (date) => {
    setDateInput(date)
    var page = 1
    setCurrentPage(0)
    window.scrollTo(0, 0)
    var dateFormat = Moment(date).format('yyyy-MM')
    navigate({
      pathname: '/admin/orders',
      search: `?page=${page}&status=${status}&date=${dateFormat}`
    })
  }

  Moment.locale('vi')
  var display_orders = ''
  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>
  } else {
    display_orders = orders.map((item) => {
      return (
        <tr key={item.id}>
          {/* <td>{item.id}</td> */}
          <td>{item.product}</td>
          <td>{Moment(item.orderDate).format('HH:mm:ss - DD/MM/yyyy')}</td>
          <td>
            {Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(item.totalPrice)}
          </td>
          <td>
            <Link to={`/admin/order-detail/${item.id}`} className="btn btn-success btn-sm">
              Chi tiết
            </Link>
          </td>
          <td>{OrderStatus[item.status].value}</td>
        </tr>
      )
    })
  }

  var displayStatus = OrderStatus.map(({ value, key }) => {
    return (
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          onChange={handleStatusClick}
          name="status"
          id={key}
          key={key}
          value={value}
          checked={OrderStatus[status].value === value}
        />
        <label className="form-check-label" htmlFor={key}>
          {value}
        </label>
      </div>
    )
  })

  return (
    <div className="container px-4 mt-3">
      <div className="card">
        <div className="card-header">
          <h4>Quản lý đơn hàng </h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8 form-group mb-4">
              <div>
                <label>Trạng thái</label>
              </div>
              {displayStatus}
            </div>
            <div className="col-md-4 form-group mb-4">
              <label>Tháng / Năm</label>
              <DatePicker
                locale={'vi'}
                selected={dateInput}
                dateFormat={'MM/yyyy'}
                onChange={(date) => handleDateChange(date)}
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  {/* <th>ID</th> */}
                  <th>Sản phẩm</th>
                  <th>Ngày đặt hàng</th>
                  <th>Tổng tiền</th>
                  <th>Xem chi tiết</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>{display_orders}</tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center">
            <div className="pagination">
              <ReactPaginate
                breakLabel="..."
                nextLabel={<i className="fas fa-chevron-right"></i>}
                onPageChange={handlePageClick}
                pageRangeDisplayed={2}
                marginPagesDisplayed={2}
                pageCount={pageCount}
                previousLabel={<i className="fas fa-chevron-left"></i>}
                renderOnZeroPageCount={null}
                activeClassName="active"
                forcePage={parseInt(currentPage) - 1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Order

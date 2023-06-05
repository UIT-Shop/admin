import axios from 'axios'
import vi from 'date-fns/locale/vi'
import Moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import DatePicker, { registerLocale } from 'react-datepicker'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import '../../../common/assets/css/paginate.css'

function WarehouseStatistic() {
  registerLocale('vi', vi)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [viewProductStore, setProductStore] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [warehouseList, setWarehouseList] = useState([])
  const [dateInput, setDateInput] = useState(new Date())
  // const [productId, setProductId] = useState('')
  const [errorlist, setError] = useState([])
  const [currentTab, setCurrentTab] = useState(0)
  const [infoInput, setInfoInput] = useState({
    warehouse_id: '',
    product_id: '',
    product_name: ''
  })

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    // setCurrentPage(searchParams.get('page'))
    axios.get(`/Warehouse`).then((res) => {
      if (isMounted)
        if (res.status === 200) {
          setWarehouseList(res.data.data)
        }
    })

    // axios
    //   .get(`/Product/admin?page=${parseInt(searchParams.get('page'))}`)
    //   .then((res) => {
    //     if (isMounted) {
    //       if (res.status === 200) {
    //         setProduct(res.data.data.products)
    //         setPageCount(res.data.data.pages)
    //         setLoading(false)
    //       }
    //       if (res.status === 500)
    //         toast.error('Lỗi máy chủ', {
    //           position: 'top-right',
    //           autoClose: 5000,
    //           hideProgressBar: false,
    //           closeOnClick: true,
    //           pauseOnHover: true,
    //           draggable: true,
    //           progress: undefined,
    //           theme: 'colored'
    //         })
    //     }
    //   })
    //   .catch((err) => {
    //     if (err.response.status === 500)
    //       toast.error('Lỗi máy chủ', {
    //         position: 'top-right',
    //         autoClose: 5000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: 'colored'
    //       })
    //   })
    return () => {
      isMounted = false
    }
  }, [currentPage])

  const validate = () => {
    if (
      parseInt(currentTab) === 0 &&
      (infoInput.warehouse_id.trim() === '' || !Moment(dateInput).isValid())
    ) {
      return false
    }
    if (
      parseInt(currentTab) === 1 &&
      (infoInput.product_id.trim() === '' || !Moment(dateInput).isValid())
    ) {
      return false
    }
    return true
  }
  // Invoke when user click to request another page.
  // const handlePageClick = (event) => {
  //   var page = parseInt(event.selected) + 1
  //   setCurrentPage(parseInt(event.selected))
  //   window.scrollTo(0, 0)
  //   navigate({ pathname: '/admin/view-product', search: `?page=${page}` })
  // }

  const handleInput = (e) => {
    e.persist()
    setInfoInput({ ...infoInput, [e.target.name]: e.target.value })

    getData(e.target.value, dateInput)
  }

  const handleTabChange = (tab) => {
    setCurrentTab(tab)
    setProductStore([])
    setInfoInput({
      warehouse_id: '',
      product_id: '',
      product_name: ''
    })
  }

  const handleDateChange = (date) => {
    setDateInput(date)
    if (parseInt(currentTab) === 0) getData(infoInput.warehouse_id, date)
    else getData(infoInput.product_id, date)
  }

  const getData = (id, date) => {
    if (validate) {
      let date_tmp = Moment(date).format('yyyy-MM-15 HH:mm:ss')
      if (parseInt(currentTab) === 0) {
        axios.get(`/ProductVariant/StoreByWarehouse/${id}/${date_tmp}`).then((res) => {
          if (res.status === 200) {
            setProductStore(res.data.data)
            console.log(res.data.data)
          }
          if (res.status === 500)
            toast.error('Lỗi máy chủ', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
        })
      }
      if (parseInt(currentTab) === 1) {
        axios.get(`/Product/${id}`).then((res) => {
          if (res.status === 200) {
            setInfoInput({
              warehouse_id: '',
              product_id: res.data.data.id,
              product_name: res.data.data.title
            })
          }
        })
        axios.get(`/ProductVariant/StoreByProduct/${id}/${date_tmp}`).then((res) => {
          if (res.status === 200) {
            setProductStore(res.data.data)
          }
          if (res.status === 500)
            toast.error('Lỗi máy chủ', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'colored'
            })
        })
      }
    }
  }

  let dispay_table
  if (parseInt(currentTab) === 0) {
    dispay_table = (
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th rowSpan="2" className="text-center">
              ID
            </th>
            <th rowSpan="2" className="text-center">
              Tên sản phẩm
            </th>
            <th rowSpan="2" className="text-center">
              Quy cách
            </th>
            <th colSpan="4" className="text-center">
              Số lượng tồn kho
            </th>
          </tr>
          <tr>
            <th className="text-center">Tháng trước</th>
            <th className="text-center">Nhập kho</th>
            <th className="text-center">Xuất kho</th>
            <th className="text-center">Tháng này</th>
          </tr>
        </thead>
        <tbody>
          {viewProductStore.map((item, index) => (
            <tr key={index}>
              <td>{item.productId}</td>
              <td>{item.productName}</td>
              <td>{item.color + ' - ' + item.size}</td>
              <td>0</td>
              <td>{item.quantityIn}</td>
              <td>{-item.quantityOut}</td>
              <td>{0 + item.quantityIn + item.quantityOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  } else {
    dispay_table = (
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th rowSpan="2" className="text-center">
              ID
            </th>
            <th rowSpan="2" className="text-center">
              Tên kho
            </th>
            <th rowSpan="2" className="text-center">
              Quy cách
            </th>
            <th colSpan="4" className="text-center">
              Số lượng tồn kho
            </th>
          </tr>
          <tr>
            <th className="text-center">Tháng trước</th>
            <th className="text-center">Nhập kho</th>
            <th className="text-center">Xuất kho</th>
            <th className="text-center">Tháng này</th>
          </tr>
        </thead>
        <tbody>
          {viewProductStore.map((item, index) => (
            <tr key={index}>
              <td>{item.warehouseId}</td>
              <td>{item.warehouseName}</td>
              <td>{item.color + ' - ' + item.size}</td>
              <td>0</td>
              <td>{item.quantityIn}</td>
              <td>{-item.quantityOut}</td>
              <td>{0 + item.quantityIn + item.quantityOut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className="container px-4 mt-3">
      <div className="card">
        <div className="card-header">
          <h4>
            Danh sách sản phẩm
            <Link to="/admin/add-product" className="btn btn-primary btn-sm float-end">
              Thêm sản phẩm
            </Link>
          </h4>
          <ToastContainer />
        </div>
        <div className="card-body">
          <Tabs
            activeKey={parseInt(currentTab)}
            onSelect={(k) => handleTabChange(k)}
            id="controlled-tab-example">
            <Tab eventKey={0} title="Theo kho">
              <div
                className="tab-pane card-body border fade show active"
                id="byWarehouse"
                role="tabpanel"
                aria-labelledby="home-tab">
                <div className="row">
                  <div className="col-md-6 form-group mb-4">
                    <label>Kho</label>
                    <select
                      name="warehouse_id"
                      onChange={handleInput}
                      value={infoInput.warehouse_id}
                      className="form-control">
                      <option>Chọn kho</option>
                      {warehouseList.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <small className="text-danger">{errorlist.warehouse_id}</small>
                  </div>
                  <div className="col-md-6 form-group mb-4">
                    <label>Tháng / Năm</label>
                    <DatePicker
                      locale={'vi'}
                      selected={dateInput}
                      dateFormat={'MM/yyyy'}
                      onChange={(date) => handleDateChange(date)}
                    />
                    <small className="text-danger">{errorlist.date}</small>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab eventKey={1} title="Theo sản phẩm">
              <div
                className="tab-pane card-body border fade show active"
                id="byProduct"
                role="tabpanel"
                aria-labelledby="byProduct-tab">
                <div className="row">
                  <div className="col-md-2 form-group mb-4">
                    <label>Mã sản phẩm</label>
                    <input
                      name="product_id"
                      value={infoInput.product_id}
                      type="text"
                      className="form-control"
                      onChange={handleInput}
                    />

                    <small className="text-danger">{errorlist.warehouse_from_id}</small>
                  </div>
                  <div className="col-md-6 form-group mb-4">
                    <label>Tên sản phẩm</label>
                    <input
                      name="product_name"
                      value={infoInput.product_name}
                      type="text"
                      aria-disabled={true}
                      className="form-control"
                    />
                    <small className="text-danger">{errorlist.product_id}</small>
                  </div>

                  <div className="col-md-4 form-group mb-4">
                    <label>Tháng / Năm</label>
                    <DatePicker
                      locale={'vi'}
                      selected={dateInput}
                      dateFormat={'MM/yyyy'}
                      onChange={(date) => handleDateChange(date)}
                    />
                    <small className="text-danger">{errorlist.date}</small>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>

          <div className="table-responsive">{dispay_table}</div>
        </div>
        {/* <div className="d-flex justify-content-center">
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
        </div> */}
      </div>
    </div>
  )
}

export default WarehouseStatistic

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

function ViewWarehouse() {
  const [loading, setLoading] = useState(true)
  const [warehouselist, setWarehouselist] = useState([])

  useEffect(() => {
    let isMounted = true

    axios.get(`/Warehouse`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setWarehouselist(res.data.data)
          setLoading(false)
        }
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const deleteWarehouse = (e, id) => {
    e.preventDefault()

    const thisClicked = e.currentTarget
    thisClicked.innerText = 'Deleting'

    axios.delete(`/Warehouse/${id}`).then((res) => {
      if (res.status === 200) {
        toast.success('Xóa thành công', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored'
        })
        thisClicked.closest('tr').remove()
      } else if (res.status === 404) {
        thisClicked.innerText = 'Delete'
      }
    })
  }

  var viewwarehouse_HTMLTABLE = ''
  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>
  } else {
    viewwarehouse_HTMLTABLE = warehouselist.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.address.fullAddress} </td>
          <td>{item.phone}</td>
          {/* <td>{item.url}</td> */}
          <td>
            <Link to={`/admin/edit-warehouse/${item.id}`} className="btn btn-success btn-sm">
              Sửa
            </Link>
          </td>
          <td>
            <button
              type="button"
              onClick={(e) => deleteWarehouse(e, item.id)}
              className="btn btn-danger btn-sm">
              Xóa
            </button>
          </td>
        </tr>
      )
    })
  }

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Danh sách kho
            <Link to="/admin/add-warehouse" className="btn btn-primary float-end">
              Thêm kho
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Sửa</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>{viewwarehouse_HTMLTABLE}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ViewWarehouse

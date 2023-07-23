import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import '../../common/assets/css/paginate.css'

function ViewProduct() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [viewProduct, setProduct] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [searchProduct, setSearchProduct] = useState()

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setCurrentPage(searchParams.get('page'))
    let apiUrl = `/Product/admin?page=${parseInt(searchParams.get('page'))}`
    if (searchParams.get('product') != null)
      apiUrl = `/Product/search/${searchParams.get('product')}/${parseInt(
        searchParams.get('page')
      )}/1`
    axios
      .get(apiUrl)
      .then((res) => {
        if (isMounted) {
          if (res.status === 200) {
            setProduct(res.data.data.products)

            setPageCount(res.data.data.pages)
            setLoading(false)
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
        }
      })
      .catch((err) => {
        if (err.response.status === 500)
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
    return () => {
      isMounted = false
    }
  }, [currentPage])

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    var page = parseInt(event.selected) + 1
    setCurrentPage(parseInt(event.selected))
    window.scrollTo(0, 0)
    let searchUrl = `?page=${page}`
    if (searchProduct != null) searchUrl = searchUrl + `&product=${searchProduct}`
    navigate({ pathname: '/admin/view-product', search: searchUrl })
  }

  // const handleKeypress = (e) => {
  //   //it triggers by pressing the enter key
  //   if (e.keyCode === 13) {
  //     handleSearchClick()
  //   }
  // }

  const handleSearchClick = () => {
    console.log('search: ', searchProduct)
    var page = 1
    setCurrentPage(0)
    window.scrollTo(0, 0)
    //navigate({ pathname: '/admin/view-product', search: `?page=${page}` })
    navigate({ pathname: '/admin/view-product', search: `?page=${page}&product=${searchProduct}` })
  }

  let display_Productdata = ''
  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>
  } else {
    display_Productdata = viewProduct.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.title}</td>
          <td>{item.description}</td>
          <td>
            {Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(item.variants.length > 0 ? item.variants[0].price : 0)}
          </td>
          <td>
            <img
              src={item.images.length > 0 ? item.images[0].url : null}
              width="50px"
              alt={item.title}
            />
          </td>
          <td>
            <Link to={`/admin/edit-product/${item.id}`} className="btn btn-success btn-sm">
              Sửa
            </Link>
          </td>
          <td>{item.visible ? 'Hiện' : 'Ẩn'}</td>
        </tr>
      )
    })
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
          <form>
            <div className="form-group mb-4">
              <div className="row">
                <div className="col-md-8 form-group mb-4">
                  <input
                    type="text"
                    onChange={(e) => setSearchProduct(e.target.value)}
                    value={searchProduct}
                    placeholder="Tìm kiếm"
                    className="form-control"
                  />
                </div>
                <div className="col-md-4 form-group mb-4">
                  <button
                    className="btn btn-primary"
                    type="button"
                    // onKeyUp={handleKeypress}
                    onClick={handleSearchClick}>
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Mô tả</th>
                  <th>Giá bán</th>
                  <th>Ảnh</th>
                  <th>Sửa</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>{display_Productdata}</tbody>
            </table>
          </div>
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
  )
}

export default ViewProduct

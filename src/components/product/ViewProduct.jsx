import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../../common/assets/css/paginate.css';
import { ToastContainer, toast } from 'react-toastify';

function ViewProduct() {
  const [loading, setLoading] = useState(true);
  const [viewProduct, setProduct] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // let pageNumber = searchParams.get('page');
  // if (pageNumber === null) pageNumber = 0;
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get(`/Product/admin?page=${parseInt(currentPage) + 1}`)
      .then((res) => {
        if (isMounted) {
          if (res.status === 200) {
            console.log(res.data.data);
            setProduct(res.data.data.products);
            setPageCount(res.data.data.pages);
            setLoading(false);
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
              theme: 'colored',
            });
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
            theme: 'colored',
          });
      });
    return () => {
      isMounted = false;
    };
  }, [currentPage]);
  // useEffect(() => {
  //   setCurrentPage(pageNumber);
  // }, [pageNumber]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    var page = parseInt(event.selected) + 1;
    setCurrentPage(parseInt(event.selected));
    window.scrollTo(0, 0);
    navigate('/admin/view-product?page=' + page);
  };

  var display_Productdata = '';
  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>;
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
              currency: 'VND',
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
            <Link
              to={`/admin/edit-product/${item.id}`}
              className="btn btn-success btn-sm"
            >
              Sửa
            </Link>
          </td>
          <td>{item.visible ? 'Hiện' : 'Ẩn'}</td>
        </tr>
      );
    });
  }

  return (
    <div className="container px-4 mt-3">
      <div className="card">
        <div className="card-header">
          <h4>
            Danh sách sản phẩm
            <Link
              to="/admin/add-product"
              className="btn btn-primary btn-sm float-end"
            >
              Thêm sản phẩm
            </Link>
          </h4>
          <ToastContainer />
        </div>
        <div className="card-body">
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
        <div className="text-center">
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
              forcePage={parseInt(currentPage)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProduct;

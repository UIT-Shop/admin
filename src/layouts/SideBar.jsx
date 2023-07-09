import Moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'

const SideBar = () => {
  const current = new Date()
  var dateFormat = Moment(current).format('yyyy-MM')
  return (
    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div className="sb-sidenav-menu">
        <div className="nav">
          <div className="sb-sidenav-menu-heading">Danh mục chính</div>
          <Link className="nav-link" to="/admin/dashboard">
            <div className="sb-nav-link-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            Dashboard
          </Link>

          <Link
            className="nav-link"
            to={{
              pathname: '/admin/orders',
              search: `?page=1&status=0&date=${dateFormat}`
            }}>
            <div className="sb-nav-link-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            Đơn hàng
          </Link>

          <Link
            className="nav-link collapsed"
            to="#"
            data-bs-toggle="collapse"
            data-bs-target="#collapseProduct"
            aria-expanded="false"
            aria-controls="collapseProduct">
            <div className="sb-nav-link-icon">
              <i className="fas fa-columns"></i>
            </div>
            Sản phẩm
            <div className="sb-sidenav-collapse-arrow">
              <i className="fas fa-angle-down"></i>
            </div>
          </Link>
          <div
            className="collapse"
            id="collapseProduct"
            aria-labelledby="headingOne"
            data-bs-parent="#sidenavAccordion">
            <nav className="sb-sidenav-menu-nested nav">
              <Link className="nav-link" to="/admin/add-product">
                Thêm sản phẩm
              </Link>
              <Link className="nav-link" to="/admin/view-product?page=1">
                Xem sản phẩm
              </Link>
            </nav>
          </div>

          <Link
            className="nav-link collapsed"
            to="#"
            data-bs-toggle="collapse"
            data-bs-target="#collapseWarehouse"
            aria-expanded="false"
            aria-controls="collapseWarehouse">
            <div className="sb-nav-link-icon">
              <i className="fas fa-columns"></i>
            </div>
            Kho
            <div className="sb-sidenav-collapse-arrow">
              <i className="fas fa-angle-down"></i>
            </div>
          </Link>
          <div
            className="collapse"
            id="collapseWarehouse"
            aria-labelledby="headingOne"
            data-bs-parent="#sidenavAccordion">
            <nav className="sb-sidenav-menu-nested nav">
              <Link className="nav-link" to="/admin/add-product-2-warehouse">
                Nhập kho
              </Link>
              <Link className="nav-link" to="/admin/move-product-2-warehouse">
                Di chuyển kho
              </Link>
              <Link className="nav-link" to="/admin/warehouse-statistic">
                Thống kê tồn kho
              </Link>
            </nav>
          </div>

          <div className="sb-sidenav-menu-heading">Danh mục phụ</div>
          <Link className="nav-link" to="/admin/add-category">
            <div className="sb-nav-link-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            Phân loại
          </Link>
          <Link className="nav-link" to="/admin/view-warehouse">
            <div className="sb-nav-link-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            Kho
          </Link>
          <Link className="nav-link" to="/admin/add-brand">
            <div className="sb-nav-link-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            Nhãn hiệu
          </Link>
          <Link className="nav-link" to="/admin/add-color">
            <div className="sb-nav-link-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            Màu sắc
          </Link>

          <div className="sb-sidenav-menu-heading">Tài khoản</div>
          <Link className="nav-link" to="/admin/view-user">
            <div className="sb-nav-link-icon">
              <i className="fas fa-tachometer-alt"></i>
            </div>
            Quản lý tài khoản
          </Link>
          <Link
            className="nav-link collapsed"
            to="#"
            data-bs-toggle="collapse"
            data-bs-target="#collapseLayouts"
            aria-expanded="false"
            aria-controls="collapseLayouts">
            <div className="sb-nav-link-icon">
              <i className="fas fa-columns"></i>
            </div>
            Cá nhân
            <div className="sb-sidenav-collapse-arrow">
              <i className="fas fa-angle-down"></i>
            </div>
          </Link>
          <div
            className="collapse"
            id="collapseLayouts"
            aria-labelledby="headingOne"
            data-bs-parent="#sidenavAccordion">
            <nav className="sb-sidenav-menu-nested nav">
              <Link className="nav-link" to="/admin/profile">
                Cá nhân
              </Link>
              <Link className="nav-link" to="/admin/change-password">
                Đổi mật khẩu
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="sb-sidenav-footer">
        <div className="small">Đăng nhập bởi:</div>
        {localStorage.getItem('auth_name')}
      </div>
    </nav>
  )
}

export default SideBar

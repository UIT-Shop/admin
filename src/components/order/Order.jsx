import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Moment from 'moment';
import { OrderStatus } from '../../common/constant/OrderStatus';

function Order() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;
    axios.get(`/Order/admin`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setOrders(res.data.data);
          setLoading(false);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  Moment.locale('vi');
  var display_orders = '';
  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>;
  } else {
    display_orders = orders.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.product}</td>
          <td>{Moment(item.orderDate).format('HH:mm:ss - DD/MM/yyyy')}</td>
          <td>
            {Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(item.totalPrice)}
          </td>
          <td>
            <Link
              to={`/admin/order-detail/${item.id}`}
              className="btn btn-success btn-sm"
            >
              Sửa
            </Link>
          </td>
          <td>{OrderStatus[item.status].value}</td>
        </tr>
      );
    });
  }

  return (
    <div className="container px-4 mt-3">
      <div className="card">
        <div className="card-header">
          <h4>Orders </h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sản phẩm</th>
                  <th>Ngày đặt hàng</th>
                  <th>Tổng tiền</th>
                  <th>Sửa</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>{display_orders}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;

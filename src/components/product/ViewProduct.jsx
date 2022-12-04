import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ViewProduct() {
  const [loading, setLoading] = useState(true);
  const [viewProduct, setProduct] = useState([]);
  const apiImage = 'https://api.cloudinary.com/v1_1/nam-duong/upload';
  useEffect(() => {
    let isMounted = true;
    document.title = 'View Product';

    axios.get(`/Product/admin?page=1`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setProduct(res.data.data.products);
          setLoading(false);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const getImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'uploadPimage');
    const res = await axios.post(apiImage, formData);
    const data = res.data;
    if (data != null) {
      const url = data.secure_url;
      return <img src={url} width="50px" alt={'image'} />;
    }
  };

  var display_Productdata = '';
  if (loading) {
    return <h4>View Products Loading...</h4>;
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
            }).format(item.variants[0].price)}
          </td>
          <td>
            <img src={item.images[0].url} width="50px" alt={item.title} />
          </td>
          <td>
            <Link
              to={`/admin/edit-product/${item.id}`}
              className="btn btn-success btn-sm"
            >
              Edit
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
            View Product
            <Link
              to="/admin/add-product"
              className="btn btn-primary btn-sm float-end"
            >
              Add Product
            </Link>
          </h4>
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
      </div>
    </div>
  );
}

export default ViewProduct;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Variant from './Variant';

function AddProduct() {
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [productInput, setProduct] = useState({
    category_id: '',
    brand_id: '',
    title: '',
    description: '',

    meta_title: '',
    meta_keyword: '',
    meta_descrip: '',

    isNew: false,
    visible: true,
  });
  const [pictures, setPictures] = useState([]);
  const [errorlist, setError] = useState([]);
  const [gender, setGender] = useState('Nam');
  const [variantList, setVariantList] = useState([
    {
      colorId: '',
      price: '',
      originalPrice: '',
      quantity: '',
      productSize: '',
      image: '',
      isNew: false,
      visible: true,
    },
  ]);
  const apiImage = 'https://api.cloudinary.com/v1_1/nam-duong/upload';
  useEffect(() => {
    let isMounted = true;
    console.log(isMounted);
    axios.get(`/Brand`).then((res) => {
      if (isMounted)
        if (res.status === 200) {
          setBrandList(res.data.data);
        }
    });

    axios.get(`/Category`).then((res) => {
      if (isMounted)
        if (res.status === 200) {
          setCategoryList(res.data.data);
        }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInput = (e) => {
    e.persist();
    setProduct({ ...productInput, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    e.persist();
    setProduct({ ...productInput, [e.target.name]: e.target.checked });
  };

  const handleImage = (e) => {
    e.preventDefault();
    const arrayFile = [...e.target.files].map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );
    setPictures((prevFiles) => prevFiles.concat(arrayFile));
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = (index) => {
    const list = [...pictures];
    list.splice(index, 1);
    setPictures(list);
  };

  const updateGender = (e) => {
    setGender(e.target.value);
  };

  const validate = () => {
    if (
      productInput.brand_id === '' ||
      productInput.category_id === '' ||
      productInput.description === '' ||
      productInput.title === ''
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return false;
    }
    if (pictures.length === 0) {
      toast.error('Vui lòng thêm hình cho sản phẩm', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      return false;
    }
    let checkVariant = true;
    variantList.map((variant) => {
      if (
        variant.price === '' ||
        variant.image === '' ||
        variant.colorId === '' ||
        variant.originalPrice === '' ||
        variant.quantity === '' ||
        variant.productSize === ''
      ) {
        toast.error('Vui lòng điền đầy đủ thông tin chi tiết', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        checkVariant = false;
      }
    });
    return checkVariant;
  };

  const submitProduct = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const formData = new FormData();

    formData.append('meta_title', productInput.meta_title);
    formData.append('meta_keyword', productInput.meta_keyword);
    formData.append('meta_descrip', productInput.meta_descrip);

    axios
      .post(`/Product`, {
        title: productInput.title,
        description: productInput.description,
        categoryId: productInput.category_id,
        brandId: productInput.brand_id,
        isNew: productInput.isNew,
        visible: productInput.visible,
      })
      .then(async (res) => {
        const productId = res.data.data.id;
        let imageUrls = [];
        console.log('submmitting');
        for (let file of pictures) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'uploadPimage');
          const res = await fetch(apiImage, {
            method: 'post',
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => data);
          if (res != null) {
            const url = res.secure_url;
            imageUrls = imageUrls.concat(url);
          }
          URL.revokeObjectURL(file);
        }
        for (let imageUrl of imageUrls) {
          axios.post(`/Image`, {
            productId,
            url: imageUrl,
          });
        }
        for (let variant of variantList) {
          const formData = new FormData();
          formData.append('file', variant.image);
          formData.append('upload_preset', 'uploadPimage');
          const res = await fetch(apiImage, { method: 'post', body: formData })
            .then((response) => response.json())
            .then((data) => data);
          if (res != null) {
            const url = res.secure_url;
            axios.post(`/Image`, {
              productId,
              colorId: variant.colorId,
              url,
            });
          }
          URL.revokeObjectURL(variant.image);

          axios.post(`/ProductVariant`, {
            productId,
            colorId: variant.colorId,
            price: variant.price,
            originalPrice: variant.originalPrice,
            quantity: variant.quantity,
            productSize: variant.productSize,
          });
        }

        toast.success('Thêm thành công', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        setProduct({
          ...productInput,
          category_id: '',
          brand_id: '',
          title: '',
          description: '',

          meta_title: '',
          meta_keyword: '',
          meta_descrip: '',
        });
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
          theme: 'colored',
        });
      });
  };

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Add Product
            <Link
              to="/admin/view-product"
              className="btn btn-primary btn-sm float-end"
            >
              View Product
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={submitProduct} encType="multipart/form-data">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  Sản phẩm
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="seotags-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#seotags"
                  type="button"
                  role="tab"
                  aria-controls="seotags"
                  aria-selected="false"
                >
                  Thẻ SEO
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="otherdetails-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#otherdetails"
                  type="button"
                  role="tab"
                  aria-controls="otherdetails"
                  aria-selected="false"
                >
                  Other Details
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane card-body border fade show active"
                id="home"
                role="tabpanel"
                aria-labelledby="home-tab"
              >
                <div className="form-group mb-4">
                  <label>Tiêu đề</label>
                  <input
                    type="text"
                    name="title"
                    onChange={handleInput}
                    value={productInput.title}
                    className="form-control"
                  />
                  <small className="text-danger">{errorlist.title}</small>
                </div>
                <div className="row">
                  <div className="col-md-4 form-group mb-4">
                    <div>
                      <label>Giới tính</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        onChange={updateGender}
                        name="gender"
                        id="inlineRadio1"
                        value="Nam"
                        checked={gender === 'Nam'}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio1"
                      >
                        Nam
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        onChange={updateGender}
                        id="inlineRadio2"
                        value="Nữ"
                        checked={gender === 'Nữ'}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio2"
                      >
                        Nữ
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="gender"
                        onChange={updateGender}
                        id="inlineRadio3"
                        value="Unisex"
                        checked={gender === 'Unisex'}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="inlineRadio3"
                      >
                        Unisex
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4 form-group mb-4">
                    <label>Phân loại</label>
                    <select
                      name="category_id"
                      onChange={handleInput}
                      value={productInput.category_id}
                      className="form-control"
                    >
                      <option>Chọn phân loại</option>
                      {categoryList.map((item) => {
                        if (item.gender === gender)
                          return (
                            <option value={item.id} key={item.id}>
                              {item.name}
                            </option>
                          );
                      })}
                    </select>
                    <small className="text-danger">
                      {errorlist.category_id}
                    </small>
                  </div>
                  <div className="col-md-4 form-group mb-4">
                    <label>Nhãn hiệu</label>
                    <select
                      name="brand_id"
                      onChange={handleInput}
                      value={productInput.brand_id}
                      className="form-control"
                    >
                      <option>Chọn nhãn hiệu</option>
                      {brandList.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                    <small className="text-danger">{errorlist.brand}</small>
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    onChange={handleInput}
                    value={productInput.description}
                    className="form-control"
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-4 form-group mb-4">
                    <label>Ảnh</label>
                    <input
                      type="file"
                      name="image"
                      multiple
                      accept="image/*"
                      onChange={handleImage}
                      className="form-control"
                    />
                    <small className="text-danger">{errorlist.image}</small>
                  </div>
                  <div className="form-check col-md-4 form-group mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isNew"
                      onChange={handleCheckbox}
                      value={productInput.isNew}
                      defaultChecked={productInput.isNew}
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Sản phẩm mới
                    </label>
                  </div>
                  <div className="form-check col-md-4 form-group mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="visible"
                      onChange={handleCheckbox}
                      value={productInput.visible}
                      defaultChecked={productInput.visible}
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Hiển thị
                    </label>
                  </div>
                </div>
                <div className="form-group mb-4 row">
                  {pictures.map((photo, index) => (
                    <div className="d-flex flex-column mb-2 w-25 h-25">
                      <img
                        src={photo.preview}
                        style={styles.image}
                        alt="Thumb"
                        key={index}
                      />
                      <button
                        onClick={() => removeSelectedImage(index)}
                        style={styles.delete}
                      >
                        Xóa ảnh
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="tab-pane card-body border fade"
                id="seotags"
                role="tabpanel"
                aria-labelledby="seotags-tab"
              >
                <div className="form-group mb-4">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    name="meta_title"
                    onChange={handleInput}
                    value={productInput.meta_title}
                    className="form-control"
                  />
                  <small className="text-danger">{errorlist.meta_title}</small>
                </div>
                <div className="form-group mb-4">
                  <label>Meta Keyword</label>
                  <textarea
                    name="meta_keyword"
                    onChange={handleInput}
                    value={productInput.meta_keyword}
                    className="form-control"
                  ></textarea>
                </div>
                <div className="form-group mb-4">
                  <label>Meta Description</label>
                  <textarea
                    name="meta_descrip"
                    onChange={handleInput}
                    value={productInput.meta_descrip}
                    className="form-control"
                  ></textarea>
                </div>
              </div>
              <div
                className="tab-pane card-body border fade"
                id="otherdetails"
                role="tabpanel"
                aria-labelledby="otherdetails-tab"
              >
                <Variant
                  variantList={variantList}
                  setVariantList={setVariantList}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary px-4 float-end mt-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Just some styles
const styles = {
  image: { maxWidth: '100%', maxHeight: 320 },
  delete: {
    cursor: 'pointer',
    background: 'red',
    color: 'white',
    border: 'none',
  },
};

export default AddProduct;

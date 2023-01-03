import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Variant from './Variant';
import { Stack, Tabs, Tab, Row, Button, Col, Container } from 'react-bootstrap';

function EditProduct() {
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [productInput, setProduct] = useState();
  const [pictures, setPictures] = useState([]);
  const [oldPictures, setOldPictures] = useState([]);
  const [errorlist, setError] = useState([]);
  const [gender, setGender] = useState('Nam');
  const [variantList, setVariantList] = useState([]);
  const [oldVariantList, setOldVariantList] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const apiImage = 'https://api.cloudinary.com/v1_1/nam-duong/upload';
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;

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

    axios.get(`/Product/${id}`).then((res) => {
      if (isMounted)
        if (res.status === 200) {
          setProduct(res.data.data);
          setVariantList(res.data.data.variants);
          setOldVariantList(res.data.data.variants);
          setPictures(res.data.data.images);
          setOldPictures(res.data.data.images);
          setLoading(false);
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

  const next = (e) => {
    e.preventDefault();
    setCurrentTab((prev) => prev + 1);
  };

  const prev = (e) => {
    e.preventDefault();
    setCurrentTab((prev) => prev - 1);
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
    if (productInput.visible === false)
      return true
    if (
      productInput.brandId === '' ||
      productInput.categoryId === '' ||
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
        variant.colorId === '' ||
        variant.originalPrice === '' ||
        variant.quantity === '' ||
        variant.productSize === '' ||
        variant.image === ''
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
      .put(`/Product`, {
        id,
        title: productInput.title,
        description: productInput.description,
        categoryId: productInput.categoryId,
        brandId: productInput.brandId,
        isNew: productInput.isNew,
        visible: productInput.visible,
      })
      .then(async (res) => {
        let imageUrls = [];
        console.log('submmitting');
        for (let file of pictures) {
          if (!file.preview) continue;
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
            productId: id,
            url: imageUrl,
          });
        }
        const removePicture = oldPictures.filter((x) => !pictures.includes(x));
        for (let picture of removePicture) {
          axios.delete(`/Image/${picture.id}`);
        }
        const removeVariant = oldVariantList.filter(
          (x) => !variantList.includes(x),
        );
        for (let variant of removeVariant) {
          axios.delete(`/ProductVariant/${variant.id}`);
        }
        for (let variant of variantList) {
          if (variant.image) {
            const formData = new FormData();
            formData.append('file', variant.image);
            formData.append('upload_preset', 'uploadPimage');
            const res = await fetch(apiImage, {
              method: 'post',
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => data);
            if (res != null) {
              const url = res.secure_url;
              axios.post(`/Image`, {
                productId: id,
                colorId: variant.colorId,
                url,
              });
            }
            URL.revokeObjectURL(variant.image);
          }
          if (variant.id)
            axios.put(`/ProductVariant`, {
              id: variant.id,
              productId: id,
              colorId: variant.colorId,
              price: variant.price,
              originalPrice: variant.originalPrice,
              quantity: variant.quantity,
              productSize: variant.productSize,
            });
          else
            axios.post(`/ProductVariant`, {
              productId: id,
              colorId: variant.colorId,
              price: variant.price,
              originalPrice: variant.originalPrice,
              quantity: variant.quantity,
              productSize: variant.productSize,
            });
        }

        toast.success('Sửa thành công', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
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
  if (loading) {
    return <h4>Đang tải dữ liệu...</h4>;
  }

  return (
    <div className="container-fluid px-4">
      <ToastContainer />
      <div className="card mt-4">
        <div className="card-header">
          <h4>
            Sửa sản phẩm
            <Link
              to="/admin/view-product?page=1"
              className="btn btn-primary float-end"
            >
              Xem sản phẩm
            </Link>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={submitProduct} encType="multipart/form-data">
            <Tabs activeKey={currentTab} id="controlled-tab-example">
              <Tab eventKey={0} title="Home" disabled={currentTab !== 0}>
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
                    {pictures.map((photo, index) => {
                      if (!photo.color || photo.preview)
                        return (
                          <div className="d-flex flex-column mb-2 w-25 h-25">
                            <img
                              src={photo.preview ?? photo.url}
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
                        );
                    })}
                  </div>
                </div>
              </Tab>
              <Tab eventKey={1} title="SEO" disabled={currentTab !== 1}>
                <div
                  className="tab-pane card-body border fade show active"
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
                    <small className="text-danger">
                      {errorlist.meta_title}
                    </small>
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
              </Tab>
              <Tab eventKey={2} title="Details" disabled={currentTab !== 2}>
                <div
                  className="tab-pane card-body border fade show active"
                  id="otherdetails"
                  role="tabpanel"
                  aria-labelledby="otherdetails-tab"
                >
                  <Variant
                    variantList={variantList}
                    setVariantList={setVariantList}
                    pictureList={pictures}
                    setPictures={setPictures}
                  />
                </div>
              </Tab>
            </Tabs>
            <Stack gap={3} direction="horizontal" className="float-end mt-2">
              {currentTab > 0 ? (
                <Button
                  className="success"
                  disabled={currentTab === 0}
                  onClick={prev}
                >
                  Quay lại
                </Button>
              ) : null}

              {currentTab < 2 ? (
                <Button
                  className="success"
                  disabled={currentTab === 2}
                  onClick={next}
                >
                  Tiếp
                </Button>
              ) : null}
              {currentTab === 2 ? (
                <button type="submit" className="btn btn-primary px-4 ">
                  Gửi
                </button>
              ) : null}
            </Stack>
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

export default EditProduct;

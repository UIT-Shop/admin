import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Size } from '../../common/constant/Size';
const Variant = ({ variantList, setVariantList, pictureList, setPictures }) => {
  const [colorList, setColorlist] = useState([]);

  useEffect(() => {
    let isMounted = true;

    axios.get(`/Color`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setColorlist(res.data.data);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  // This function will be triggered when the file field change
  const imageChange = (e, index) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const arrayFile = [...e.target.files].map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );
      const list = [...variantList];
      list[index].image = arrayFile[0];
      if (pictureList)
        removeSelectedImageOfPictureList({ colorId: list[index].colorId });
      setVariantList(list);
    }
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = (index) => {
    const list = [...variantList];
    list[index].image = '';
    setVariantList(list);
  };

  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImageOfPictureList = ({ e, index, colorId }) => {
    const list = [...pictureList];
    if (index >= 0) list.splice(index, 1);
    else
      for (let i = 0; i < pictureList.length; i++) {
        if (pictureList[i].colorId === colorId) list.splice(i, 1);
      }
    setPictures(list);
  };

  const handleVariantChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...variantList];
    list[index][name] = value;
    setVariantList(list);
  };

  const handleVariantRemove = (index) => {
    const list = [...variantList];
    list.splice(index, 1);
    setVariantList(list);
  };

  const handleVariantAdd = () => {
    setVariantList([
      ...variantList,
      {
        colorId: '',
        price: '',
        originalPrice: '',
        quantity: '',
        productSize: '',
        image: '',
      },
    ]);
  };

  const getImage = (variant, index) => {
    if (variant.image && variant.image.preview)
      return (
        <div style={styles.preview}>
          <img src={variant.image.preview} style={styles.image} alt="Thumb" />
          <button
            onClick={() => removeSelectedImage(index)}
            style={styles.delete}
          >
            Xóa ảnh
          </button>
        </div>
      );

    return pictureList.map((picture, idx) => {
      if (picture.colorId && picture.colorId === variant.colorId)
        return (
          <div style={styles.preview}>
            <img src={picture.url} style={styles.image} alt="Thumb" />
            <button
              onClick={(e) =>
                removeSelectedImageOfPictureList({ e: e, index: idx })
              }
              style={styles.delete}
            >
              Xóa ảnh
            </button>
          </div>
        );
    });
  };
  return (
    <div className="info__container">
      <div className="col-half-balance">
        {variantList.map((singleVariant, index) => (
          <div key={index}>
            <div className="border mb-4 px-2 ">
              <div className="row ">
                <div className="col-md-4 form-group mb-4">
                  <label>Giá bán</label>
                  <input
                    type="text"
                    name="price"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.price}
                    className="form-control"
                  />
                  <small className="text-danger">
                    {/* {errorlist.price} */}
                  </small>
                </div>
                <div className="col-md-4 form-group mb-4">
                  <label>Giá gốc</label>
                  <input
                    type="text"
                    name="originalPrice"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.originalPrice}
                    className="form-control"
                  />
                  <small className="text-danger">
                    {/* {errorlist.originalPrice} */}
                  </small>
                </div>
                <div className="col-md-4 form-group mb-4">
                  <label>Số lượng</label>
                  <input
                    type="text"
                    name="quantity"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.quantity}
                    className="form-control"
                  />
                  <small className="text-danger">
                    {/* {errorlist.quantity} */}
                  </small>
                </div>

                <div className="col-md-4 form-group mb-4">
                  <label>Ảnh</label>
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => imageChange(e, index)}
                    className="form-control"
                  />
                  <small className="text-danger">
                    {/* {errorlist.image} */}
                  </small>
                </div>
                <div className="col-md-4 form-group mb-4">
                  {getImage(singleVariant, index)}
                </div>

                <div className="col-md-4 form-group mb-4">
                  <label>Màu</label>
                  <select
                    name="colorId"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.colorId}
                    className="form-control"
                  >
                    <option>Chọn màu</option>
                    {colorList.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 form-group mb-4">
                  <label>Size</label>
                  <select
                    name="productSize"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.productSize}
                    className="form-control"
                  >
                    <option>Chọn Size</option>
                    {Size.map((item, index) => {
                      return (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-md-4 form-group mb-4">
                  <label>Featured (checked=shown)</label>
                  <input
                    type="checkbox"
                    name="featured"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.featured}
                    className="w-50 h-50"
                  />
                </div>
                <div className="col-md-4 form-group mb-4">
                  <label>Status (checked=Hidden)</label>
                  <input
                    type="checkbox"
                    name="status"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.status}
                    className="w-50 h-50"
                  />
                </div>
              </div>
              <div className="d-flex justify-content-center">
                {variantList.length !== 1 && (
                  <button
                    type="button"
                    className="btn btn-danger mb-2"
                    onClick={() => handleVariantRemove(index)}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center">
        <button
          type="button"
          className="btn btn-primary "
          onClick={handleVariantAdd}
        >
          <i className="fa fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default Variant;

// Just some styles
const styles = {
  preview: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: { maxWidth: '100%', maxHeight: 320 },
  delete: {
    cursor: 'pointer',
    padding: 15,
    background: 'red',
    color: 'white',
    border: 'none',
  },
};

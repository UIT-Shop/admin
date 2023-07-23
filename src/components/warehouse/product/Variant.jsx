import axios from 'axios'
import Moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Size } from '../../../common/constant/Size'

import './table.css'

const Variant = ({ variantList, setVariantList, dateInput, isAdd }) => {
  const [colorList, setColorlist] = useState([])

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      axios.get(`/Color`).then((res) => {
        if (res.status === 200) {
          setColorlist(res.data.data)
        }
      })
      for (let i = 0; i < 9; i++) handleVariantAdd()
    }
    return () => {
      isMounted = false
    }
  }, [])

  const handleVariantChange = async (e, index) => {
    const { name, value } = e.target
    const list = [...variantList]
    list[index][name] = value
    if (name === 'productId' && value.trim() !== '')
      await axios.get(`/Product/${value}`).then((res) => {
        if (res.status === 200) {
          let detail = res.data.data.variants

          list[index]['productName'] = res.data.data.title
          list[index]['colorList'] = colorList.filter((color) =>
            detail.some((variant) => variant.colorId === color.id)
          )
          list[index]['colorId'] = detail[0].colorId
          list[index]['size'] = detail[0].productSize
          list[index]['price'] = detail[0].originalPrice
          list[index]['lotCode'] =
            'L' +
            list[index]['productId'].padStart(5, '0') +
            '-' +
            Moment(dateInput).format('yyyyMMDD')
        }
      })
    else if (name === 'size' || name === 'colorId') {
      const productID = list[index]['productId']
      const colorId = list[index]['colorId']
      const size = list[index]['size']

      await axios.get(`/ProductVariant/${productID}/${size}/${colorId}`).then((res) => {
        if (res.status === 200) {
          list[index]['price'] = res.data.data.originalPrice
        }
      })
    }
    setVariantList(list)
  }

  const handleVariantRemove = () => {
    const list = [...variantList]
    list.pop()
    setVariantList(list)
  }

  const handleVariantAdd = () => {
    setVariantList([
      ...variantList,
      {
        productId: '',
        productName: '',
        colorList: [],
        colorId: '',
        price: '',
        size: '',
        quantity: '',
        lotCode: '',
        note: ''
      }
    ])
  }

  let display_table = ''
  if (isAdd) {
    display_table = (
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th style={styles.colCode}>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Kích thước</th>
            <th>Màu sắc</th>
            <th style={styles.colCode}>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
            <th>Số lô</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {variantList.map((singleVariant, index) => (
            <tr key={index}>
              <td>{String(index + 1).padStart(2, '0')}</td>
              <td style={styles.colCode}>
                <input
                  name="productId"
                  value={singleVariant.productId}
                  type="text"
                  onChange={(e) => handleVariantChange(e, index)}
                />
              </td>
              <td>{singleVariant.productName}</td>
              <td>
                {singleVariant.productId.trim() !== '' && (
                  <select
                    name="size"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.size}
                    className="form-control">
                    {Size.map((item, index) => {
                      return (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      )
                    })}
                  </select>
                )}
              </td>
              <td>
                {singleVariant.productId.trim() !== '' && (
                  <select
                    name="colorId"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.colorId}
                    className="form-control">
                    {singleVariant.colorList.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td style={styles.colCode}>
                <input
                  name="quantity"
                  value={singleVariant.quantity}
                  type="number"
                  onChange={(e) => handleVariantChange(e, index)}
                />
              </td>
              <td>{singleVariant.price}</td>
              <td>{singleVariant.price * singleVariant.quantity} </td>
              <td>{singleVariant.lotCode} </td>
              <td>
                <input
                  name="note"
                  type="text"
                  value={singleVariant.note}
                  onChange={(e) => handleVariantChange(e, index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  } else {
    display_table = (
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th style={styles.colCode}>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Kích thước</th>
            <th>Màu sắc</th>
            <th style={styles.colCode}>Số lượng</th>
            <th>Số lô</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {variantList.map((singleVariant, index) => (
            <tr key={index}>
              <td>{String(index + 1).padStart(2, '0')}</td>
              <td style={styles.colCode}>
                <input
                  name="productId"
                  value={singleVariant.productId}
                  type="text"
                  onChange={(e) => handleVariantChange(e, index)}
                />
              </td>
              <td>{singleVariant.productName}</td>
              <td>
                {singleVariant.productId.trim() !== '' && (
                  <select
                    name="size"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.size}
                    className="form-control">
                    {Size.map((item, index) => {
                      return (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      )
                    })}
                  </select>
                )}
              </td>
              <td>
                {singleVariant.productId.trim() !== '' && (
                  <select
                    name="colorId"
                    onChange={(e) => handleVariantChange(e, index)}
                    value={singleVariant.colorId}
                    className="form-control">
                    {singleVariant.colorList.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                )}
              </td>
              <td style={styles.colCode}>
                <input
                  name="quantity"
                  value={singleVariant.quantity}
                  type="number"
                  onChange={(e) => handleVariantChange(e, index)}
                />
              </td>
              <td>{singleVariant.lotCode} </td>
              <td>
                <input
                  name="note"
                  type="text"
                  value={singleVariant.note}
                  onChange={(e) => handleVariantChange(e, index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  return (
    <div className="info__container">
      <div className="col - half - balance">{display_table}</div>

      <div className="d-flex justify-content-center mt-2">
        {variantList.length > 10 && (
          <button
            type="button"
            className="btn btn-danger mr-2"
            onClick={() => handleVariantRemove()}>
            <i className="fas fa-minus"></i>
          </button>
        )}
        <button type="button" className="btn btn-primary ml-2" onClick={handleVariantAdd}>
          <i className="fa fa-plus"></i>
        </button>
      </div>
    </div>
  )
}

export default Variant

// Just some styles
const styles = {
  preview: {
    display: 'flex',
    flexDirection: 'column'
  },
  image: { maxWidth: '100%', maxHeight: 320 },
  delete: {
    cursor: 'pointer',
    padding: 15,
    background: 'red',
    color: 'white',
    border: 'none'
  },
  colCode: { width: '80px' }
}

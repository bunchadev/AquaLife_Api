// orderDetailsModel.js
// Model xử lý collection 'order_details' trong MongoDB.
// Order Details là danh sách các sản phẩm trong một đơn hàng (order line items).
// Relationship: orders → 1:N → order_details ← N:1 → products
//
// Tại sao cần order_details riêng?
//  → Giữ lại snapshot giá tại thời điểm đặt hàng (giá có thể thay đổi sau)
//  → 1 đơn hàng có nhiều sản phẩm với số lượng khác nhau

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators' // Fix: đúng tên file

const ORDER_DETAILS_COLLECTION_NAME = 'order_details'

const ORDER_DETAILS_COLLECTION_SCHEMA = Joi.object({
  // Fix naming: dùng 'orderId' và 'productId' (camelCase nhất quán, không dùng plural)
  // Trước đây dùng 'ordersId' và 'productsId' (sai convention)
  orderId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),

  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(), // Giá tại thời điểm đặt (snapshot price)

  createdAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) =>
  ORDER_DETAILS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

/**
 * Tạo order detail item mới.
 * Được gọi trong quá trình checkout cho từng sản phẩm trong đơn.
 */
const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const newValidData = {
    ...validData,
    orderId: new ObjectId(validData.orderId),
    productId: new ObjectId(validData.productId)
  }
  return await GET_DB().collection(ORDER_DETAILS_COLLECTION_NAME).insertOne(newValidData)
}

/**
 * Lấy tất cả items của một đơn hàng.
 * Dùng trong trang chi tiết đơn hàng.
 */
const findByOrderId = async (orderId) => {
  return await GET_DB()
    .collection(ORDER_DETAILS_COLLECTION_NAME)
    .find({ orderId: new ObjectId(orderId) })
    .toArray()
}

/**
 * Xoá tất cả items của một đơn hàng.
 * Dùng khi cancel order.
 */
const deleteByOrderId = async (orderId) => {
  return await GET_DB()
    .collection(ORDER_DETAILS_COLLECTION_NAME)
    .deleteMany({ orderId: new ObjectId(orderId) })
}

/** Tìm order detail theo ID */
const findById = async (id) => {
  return await GET_DB().collection(ORDER_DETAILS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
}

export const orderDetailsModel = {
  createNew,
  findByOrderId,
  deleteByOrderId,
  findById
}

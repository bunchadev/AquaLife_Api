// paymentsModel.js
// Model xử lý collection 'payments' trong MongoDB.
// Mỗi đơn hàng có 1 payment record ghi nhận phương thức và trạng thái thanh toán.
// Hiện tại chỉ hỗ trợ COD (Cash on Delivery) - thanh toán khi nhận hàng.

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators' // Fix: đúng tên file

const PAYMENTS_COLLECTION_NAME = 'payments'

const PAYMENTS_COLLECTION_SCHEMA = Joi.object({
  orderId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),

  // Phương thức thanh toán (hiện tại chỉ COD, tương lai có thể thêm 'vnpay', 'momo', 'banking')
  method: Joi.string().valid('cod').required(),

  // Trạng thái thanh toán:
  // - 'Đang đợi': chờ thanh toán (COD chưa nhận tiền)
  // - 'Đã thanh toán': đã thu tiền thành công
  // - 'Thất bại': thanh toán thất bại hoặc bị hủy
  status: Joi.string().valid('Đang đợi', 'Đã thanh toán', 'Thất bại').required(),

  paidAt: Joi.date().allow(null).default(null) // Null khi chưa thanh toán, có giá trị khi đã thu
})

const validateBeforeCreate = async (data) =>
  PAYMENTS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

/**
 * Tạo payment record mới cho đơn hàng.
 */
const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const newValidData = {
    ...validData,
    orderId: new ObjectId(validData.orderId),
    createdAt: new Date()
  }
  return await GET_DB().collection(PAYMENTS_COLLECTION_NAME).insertOne(newValidData)
}

/**
 * Tìm payment mới nhất của một đơn hàng.
 * Dùng để kiểm tra đơn hàng đã được thanh toán chưa trước khi tạo payment mới.
 * sort(-1) + limit(1): lấy payment gần nhất nếu có nhiều record
 */
const findLatestByOrderId = async (orderId) => {
  return await GET_DB()
    .collection(PAYMENTS_COLLECTION_NAME)
    .find({ orderId: new ObjectId(orderId) })
    .sort({ createdAt: -1 })
    .limit(1)
    .next() // next(): lấy document đầu tiên từ cursor
}

/** Cập nhật trạng thái payment (ví dụ: từ 'Đang đợi' → 'Đã thanh toán') */
const updateById = async (id, data) => {
  const update = { $set: { ...data, updatedAt: new Date() } }
  return await GET_DB().collection(PAYMENTS_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
}

export const paymentsModel = {
  createNew,
  findLatestByOrderId,
  updateById
}

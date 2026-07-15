// ordersModel.js
// Model xử lý collection 'orders' trong MongoDB.
// Đơn hàng liên kết với: users (userId), order_details (orderId), payments (orderId)

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators' // Fix: đúng tên file

const ORDERS_COLLECTION_NAME = 'orders'

// Các trạng thái đơn hàng theo luồng: Đang đợi → Đã xác nhận → Đang giao → Đã giao
// Hoặc bị hủy tại bất kỳ bước nào trước khi giao
const ORDER_STATUSES = ['Đang đợi', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy']

const ORDERS_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  address: Joi.string().min(10).max(200).required(), // Địa chỉ giao hàng
  totalPrice: Joi.number().min(0).required(),        // Tổng tiền đơn hàng
  status: Joi.string().valid(...ORDER_STATUSES).default('Đang đợi'),
  note: Joi.string().max(500).optional(),            // Ghi chú của khách
  createdAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) =>
  ORDERS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

/**
 * Tạo đơn hàng mới.
 * userId được convert sang ObjectId để có thể dùng $lookup join với users.
 */
const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const newValidData = {
    ...validData,
    userId: new ObjectId(validData.userId)
  }
  return await GET_DB().collection(ORDERS_COLLECTION_NAME).insertOne(newValidData)
}

/**
 * Lấy tất cả đơn hàng, sắp xếp mới nhất lên đầu.
 * Chỉ admin mới được gọi (kiểm tra ở service layer).
 */
const getAll = async () => {
  return await GET_DB()
    .collection(ORDERS_COLLECTION_NAME)
    .find({})
    .sort({ createdAt: -1 }) // -1: giảm dần (mới nhất lên đầu)
    .toArray()
}

/** Tìm đơn hàng theo ID */
const findById = async (id) => {
  return await GET_DB().collection(ORDERS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
}

/**
 * Lấy tất cả đơn hàng của một user, sắp xếp mới nhất lên đầu.
 * @param {string} userId - User ID dạng string
 */
const findByUserId = async (userId) => {
  return await GET_DB()
    .collection(ORDERS_COLLECTION_NAME)
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray()
}

/**
 * Cập nhật trạng thái hoặc thông tin đơn hàng.
 * Thêm updatedAt tự động khi có thay đổi.
 */
const updateById = async (id, data) => {
  const update = { $set: { ...data, updatedAt: new Date() } }
  return await GET_DB().collection(ORDERS_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
}

/** Xoá đơn hàng theo ID */
const deleteById = async (id) => {
  return await GET_DB().collection(ORDERS_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
}

export const ordersModel = {
  createNew,
  getAll,
  findById,
  findByUserId,
  updateById,
  deleteById
}

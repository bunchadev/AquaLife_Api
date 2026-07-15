// cartsModel.js
// Model xử lý collection 'carts' trong MongoDB.
// Mỗi user chỉ có 1 cart (1-1 relationship).
// Cart chứa nhiều cart_items (1-N relationship).

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators' // Fix: đúng tên file

const CARTS_COLLECTION_NAME = 'carts'

const CARTS_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  createdAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) =>
  CARTS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

/**
 * Tạo cart mới cho user.
 * Lưu ý: cartsService sẽ kiểm tra user đã có cart chưa trước khi gọi hàm này.
 */
const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const newValidData = {
    ...validData,
    userId: new ObjectId(validData.userId)
  }
  return await GET_DB().collection(CARTS_COLLECTION_NAME).insertOne(newValidData)
}

/** Lấy tất cả carts (admin only) */
const getAll = async () => {
  return await GET_DB().collection(CARTS_COLLECTION_NAME).find({}).toArray()
}

/** Tìm cart theo ID */
const getById = async (id) => {
  return await GET_DB().collection(CARTS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
}

/**
 * Tìm cart theo userId - mỗi user chỉ có 1 cart (findOne thay vì find).
 * @param {string} userId - User ID string
 * @returns {Object|null} Cart document hoặc null
 */
const getByUserId = async (userId) => {
  return await GET_DB().collection(CARTS_COLLECTION_NAME).findOne({ userId: new ObjectId(userId) })
}

/**
 * Cập nhật cart.
 * findOneAndUpdate: atomic operation - tìm và cập nhật trong 1 query
 * returnDocument: 'after' → trả về document SAU khi cập nhật (không phải trước)
 */
const updateById = async (id, data) => {
  const result = await GET_DB().collection(CARTS_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: 'after' } // Trả về document mới sau khi update
  )
  return result.value || result // Tương thích với các phiên bản MongoDB driver khác nhau
}

/** Xoá cart theo ID */
const deleteById = async (id) => {
  return await GET_DB().collection(CARTS_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
}

export const cartsModel = {
  createNew,
  getAll,
  getById,
  getByUserId,
  updateById,
  deleteById
}

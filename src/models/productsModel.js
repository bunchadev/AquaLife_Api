// productsModel.js
// Model xử lý collection 'products' trong MongoDB.
// Sản phẩm là entity trung tâm: được tham chiếu bởi cart_items, order_details, reviews.

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators' // Fix: đúng tên file

const PRODUCTS_COLLECTION_NAME = 'products'

// Schema định nghĩa cấu trúc sản phẩm
const PRODUCTS_COLLECTION_SCHEMA = Joi.object({
  // categoryId tham chiếu đến categories collection
  categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).optional(),

  name: Joi.string().required(),
  price: Joi.number().min(0).required(),      // Giá không âm
  quantity: Joi.number().min(0).default(0),   // Tồn kho, mặc định 0
  description: Joi.string().optional(),
  imageUrl: Joi.string().optional(),

  // Status: chỉ 2 trạng thái, mặc định 'Còn hàng'
  status: Joi.string().valid('Còn hàng', 'Hết hàng').default('Còn hàng'),

  created_at: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) =>
  PRODUCTS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

/**
 * Tạo sản phẩm mới trong DB.
 * Convert categoryId từ string → ObjectId để join với categories collection hiệu quả.
 */
const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const newValidData = {
    ...validData,
    // Convert string sang ObjectId nếu có categoryId
    ...(validData.categoryId && { categoryId: new ObjectId(validData.categoryId) })
  }
  return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).insertOne(newValidData)
}

/**
 * Lấy tất cả sản phẩm (chưa có pagination - sẽ thêm sau).
 * TODO: Thêm pagination, filter, sort để tránh load quá nhiều dữ liệu
 */
const getAll = async () => {
  return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).find({}).toArray()
}

/** Tìm sản phẩm theo ID */
const findById = async (id) => {
  return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
}

/** Tìm tất cả sản phẩm thuộc một category */
const findByCategory = async (categoryId) => {
  return await GET_DB()
    .collection(PRODUCTS_COLLECTION_NAME)
    .find({ categoryId: new ObjectId(categoryId) })
    .toArray()
}

/**
 * Cập nhật sản phẩm (partial update - chỉ cập nhật fields được truyền vào).
 * $set: chỉ cập nhật các field chỉ định, không ghi đè toàn bộ document
 */
const updateById = async (id, data) => {
  const update = { $set: { ...data, updated_at: new Date() } }
  return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
}

/** Xoá sản phẩm theo ID */
const deleteById = async (id) => {
  return await GET_DB().collection(PRODUCTS_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
}

export const productsModel = {
  createNew,
  getAll,
  findById,
  findByCategory,
  updateById,
  deleteById
}
// categoriesModel.js
// Model xử lý collection 'categories' trong MongoDB.
// Categories (danh mục) được tham chiếu bởi products (categoryId).

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const CATEGORIES_COLLECTION_NAME = 'categories'

const CATEGORIES_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required(),          // Tên danh mục (ví dụ: "Cá cảnh", "Phụ kiện bể")
  description: Joi.string().optional(),   // Mô tả ngắn về danh mục
  createdAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) =>
  CATEGORIES_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

/** Tạo danh mục mới */
const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  return await GET_DB().collection(CATEGORIES_COLLECTION_NAME).insertOne(validData)
}

/** Lấy tất cả danh mục */
const getAll = async () => {
  return await GET_DB().collection(CATEGORIES_COLLECTION_NAME).find({}).toArray()
}

/** Tìm danh mục theo ID */
const findById = async (id) => {
  return await GET_DB().collection(CATEGORIES_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
}

/** Cập nhật danh mục */
const updateById = async (id, data) => {
  const update = { $set: { ...data, updatedAt: new Date() } }
  return await GET_DB().collection(CATEGORIES_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
}

/** Xoá danh mục */
const deleteById = async (id) => {
  return await GET_DB().collection(CATEGORIES_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
}

export const categoriesModel = {
  createNew,
  getAll,
  findById,
  updateById,
  deleteById
}

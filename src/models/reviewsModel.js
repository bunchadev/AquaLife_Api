// reviewsModel.js
// Model xử lý collection 'reviews' trong MongoDB.
//
// Review cho phép user đánh giá sản phẩm (1-5 sao + comment).
// Mỗi user chỉ được đánh giá mỗi sản phẩm 1 lần (kiểm tra bằng findByUserAndProduct).

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const REVIEWS_COLLECTION_NAME = 'reviews'

// Schema validate dữ liệu review trước khi lưu vào DB
const REVIEWS_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),

  // Fix: thêm userName vào schema (reviewsService truyền vào nhưng schema cũ không có → bị Joi reject)
  // userName hiển thị tên người dùng trong phần đánh giá mà không cần join với users collection
  userName: Joi.string().min(1).max(100).required(),

  // Rating từ 1 đến 5 sao (integer bắt buộc)
  rating: Joi.number().integer().min(1).max(5).required(),

  // Comment có thể để trống, tối đa 500 ký tự
  comment: Joi.string().allow('').max(500).default(''),

  createdAt: Joi.date().default(() => new Date())
})

/**
 * Validate dữ liệu review trước khi lưu DB.
 * abortEarly: false → hiển thị tất cả lỗi cùng lúc thay vì dừng ở lỗi đầu tiên
 */
const validateBeforeCreate = async (data) =>
  REVIEWS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

/**
 * Tạo review mới trong DB.
 * @param {Object} data - Dữ liệu review (userId, productId, userName, rating, comment)
 * @returns {Object} Review vừa tạo (bao gồm _id được MongoDB gán)
 */
const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)

  // Convert userId và productId từ string sang ObjectId trước khi lưu
  // MongoDB dùng ObjectId để indexing và join hiệu quả hơn string
  const newValidData = {
    ...validData,
    userId: new ObjectId(validData.userId),
    productId: new ObjectId(validData.productId)
  }

  const result = await GET_DB().collection(REVIEWS_COLLECTION_NAME).insertOne(newValidData)

  // Lấy lại document vừa tạo (để trả về đầy đủ thông tin bao gồm _id)
  return await GET_DB().collection(REVIEWS_COLLECTION_NAME).findOne({ _id: result.insertedId })
}

/**
 * Lấy tất cả reviews của một sản phẩm, sắp xếp mới nhất lên đầu.
 * @param {string} productId - ID sản phẩm cần lấy reviews
 * @returns {Array} Danh sách reviews
 */
const findByProductId = async (productId) => {
  return await GET_DB()
    .collection(REVIEWS_COLLECTION_NAME)
    .find({ productId: new ObjectId(productId) })
    .sort({ createdAt: -1 }) // Mới nhất lên đầu
    .toArray()
}

/**
 * Kiểm tra user đã review sản phẩm này chưa.
 * Dùng để ngăn duplicate review (1 user = 1 review / sản phẩm).
 * @param {string} userId - ID người dùng
 * @param {string} productId - ID sản phẩm
 * @returns {Object|null} Review nếu đã tồn tại, null nếu chưa
 */
const findByUserAndProduct = async (userId, productId) => {
  return await GET_DB().collection(REVIEWS_COLLECTION_NAME).findOne({
    userId: new ObjectId(userId),
    productId: new ObjectId(productId)
  })
}

export const reviewsModel = {
  createNew,
  findByProductId,
  findByUserAndProduct
}

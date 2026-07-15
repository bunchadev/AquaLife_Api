// reviewsService.js
// Service layer cho reviews (đánh giá sản phẩm).
//
// Business rules:
//  - Mỗi user chỉ được đánh giá 1 sản phẩm 1 lần
//  - Cần thông tin user (id + name) để ghi vào review
//  - Rating từ 1 đến 5 sao

import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { reviewsModel } from '~/models/reviewsModel'

/**
 * Normalize ObjectId sang string để trả về API response nhất quán.
 * MongoDB ObjectId khi JSON.stringify sẽ là object - cần convert sang string.
 */
const normalizeReview = (item) => {
  if (!item) return item
  return {
    ...item,
    userId: item.userId?.toString ? item.userId.toString() : item.userId,
    productId: item.productId?.toString ? item.productId.toString() : item.productId
  }
}

/**
 * Tạo review mới cho sản phẩm.
 * Flow: Kiểm tra user đã review chưa → Tạo review → Normalize → Trả về
 *
 * @param {Object} data - { productId, rating, comment, userId?, userName? }
 * @param {Object} user - User payload từ JWT (req.user)
 */
const createNew = async (data, user) => {
  // Lấy userId và userName từ body (nếu gửi kèm) hoặc từ JWT payload
  const userId = data?.userId || user?.id
  const userName = data?.userName || user?.name

  if (!userId || !userName) {
    throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Thiếu thông tin người dùng')
  }

  // Kiểm tra đã review sản phẩm này chưa (1 user = 1 review / sản phẩm)
  const existing = await reviewsModel.findByUserAndProduct(userId, data?.productId)
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, 'Bạn đã đánh giá sản phẩm này rồi')
  }

  const created = await reviewsModel.createNew({
    userId,
    userName,
    productId: data?.productId,
    rating: data?.rating,
    comment: data?.comment || ''
  })

  return normalizeReview(created)
}

/**
 * Lấy tất cả reviews của một sản phẩm.
 * @param {string} productId - Product ID
 * @returns {Array} Danh sách reviews đã normalize
 */
const findByProductId = async (productId) => {
  const items = await reviewsModel.findByProductId(productId)
  return items.map(normalizeReview) // Normalize từng item trước khi trả về
}

export const reviewsService = {
  createNew,
  findByProductId
}

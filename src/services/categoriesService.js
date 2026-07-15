// categoriesService.js
// Service layer cho categories (danh mục sản phẩm).

import { categoriesModel } from '~/models/categoriesModel.js'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

/**
 * Tạo danh mục mới.
 * @param {Object} data - { name, description }
 */
const createNew = async (data) => {
  return await categoriesModel.createNew(data)
}

/**
 * Lấy tất cả danh mục.
 * Thường được dùng để render menu filter ở trang Shop.
 */
const getAll = async () => {
  return await categoriesModel.getAll()
}

/**
 * Tìm danh mục theo ID.
 * @param {string} id - Category ID
 * @returns {Object} Category
 * @throws {ApiError} 404 nếu không tìm thấy
 */
const findById = async (id) => {
  const category = await categoriesModel.findById(id)
  if (!category) throw new ApiError(StatusCodes.NOT_FOUND, 'Danh mục không tồn tại')
  return category
}

/**
 * Cập nhật danh mục.
 * Lấy lại từ DB sau khi cập nhật để trả về data đầy đủ.
 */
const updateById = async (id, data) => {
  await findById(id) // Kiểm tra tồn tại trước khi update
  await categoriesModel.updateById(id, data)
  return await categoriesModel.findById(id)
}

/**
 * Xoá danh mục.
 * Lưu ý: Cần cân nhắc xử lý products thuộc category này (set null hoặc từ chối xoá)
 */
const deleteById = async (id) => {
  await findById(id) // Kiểm tra tồn tại trước khi xoá
  return await categoriesModel.deleteById(id)
}

export const categoriesService = {
  createNew,
  getAll,
  findById,
  updateById,
  deleteById
}

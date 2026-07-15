// productsService.js
// Service layer xử lý logic nghiệp vụ cho products.
// Tầng trung gian giữa controller và model:
//  - Không xử lý HTTP (HTTP là việc của Controller)
//  - Không trực tiếp query DB (DB là việc của Model)
//  - Xử lý: business rules, data transformation, error handling

import { productsModel } from '~/models/productsModel.js'

/**
 * Tạo sản phẩm mới.
 * @param {Object} data - Dữ liệu sản phẩm từ request body
 * @returns {Object} Kết quả insertOne từ MongoDB
 */
const createNew = async (data) => {
  return await productsModel.createNew(data)
}

/**
 * Lấy tất cả sản phẩm.
 * TODO: Thêm pagination (page, limit) và filter (category, status, priceRange)
 *       khi số lượng sản phẩm tăng lên nhiều
 */
const getAll = async () => {
  return await productsModel.getAll()
}

/**
 * Tìm sản phẩm theo ID.
 * @param {string} id - Product ID (MongoDB ObjectId dạng string)
 * @returns {Object|null} Product hoặc null nếu không tìm thấy
 */
const findById = async (id) => {
  return await productsModel.findById(id)
}

/**
 * Tìm sản phẩm theo danh mục.
 * @param {string} categoryId - Category ID
 * @returns {Array} Danh sách sản phẩm trong category
 */
const findByCategory = async (categoryId) => {
  return await productsModel.findByCategory(categoryId)
}

/**
 * Cập nhật sản phẩm.
 * Sau khi update model, lấy lại từ DB để trả về data mới nhất (bao gồm updatedAt).
 * @param {string} id - Product ID
 * @param {Object} data - Dữ liệu cập nhật
 * @returns {Object} Product sau khi cập nhật
 */
const updateById = async (id, data) => {
  await productsModel.updateById(id, data)
  return await productsModel.findById(id) // Lấy lại để trả về data đầy đủ
}

/**
 * Xoá sản phẩm theo ID.
 * @param {string} id - Product ID
 * @returns {Object} Kết quả deleteOne từ MongoDB
 */
const deleteById = async (id) => {
  return await productsModel.deleteById(id)
}

export const productsService = {
  createNew,
  getAll,
  findById,
  findByCategory,
  updateById,
  deleteById
}
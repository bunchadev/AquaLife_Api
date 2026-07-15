// cartItemsModel.js
// Model xử lý collection 'cart_items' trong MongoDB.
// Mỗi cart_item là 1 sản phẩm trong giỏ hàng (cartId + productId + quantity).
// Relationship: cart → 1:N → cart_items ← N:1 → products

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators' // Fix: đúng tên file

const CART_ITEMS_COLLECTION_NAME = 'cart_items'

const CART_ITEMS_COLLECTION_SCHEMA = Joi.object({
  cartId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  quantity: Joi.number().integer().min(1).required() // Số lượng tối thiểu 1
})

const validateBeforeCreate = async (data) =>
  CART_ITEMS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

/**
 * Thêm sản phẩm mới vào giỏ hàng.
 * cartItemsService sẽ kiểm tra sản phẩm đã trong giỏ chưa - nếu rồi thì update qty.
 */
const createNew = async (data) => {
  const validData = await validateBeforeCreate(data)
  const newValidData = {
    ...validData,
    cartId: new ObjectId(validData.cartId),
    productId: new ObjectId(validData.productId)
  }
  return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).insertOne(newValidData)
}

/** Lấy tất cả cart items (admin) */
const getAll = async () => {
  return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).find({}).toArray()
}

/** Tìm cart item theo ID */
const getById = async (id) => {
  return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
}

/**
 * Lấy tất cả items trong một cart.
 * @param {string} cartId - Cart ID string
 * @returns {Array} Danh sách items trong cart
 */
const getByCartId = async (cartId) => {
  return await GET_DB()
    .collection(CART_ITEMS_COLLECTION_NAME)
    .find({ cartId: new ObjectId(cartId) })
    .toArray()
}

/**
 * Tìm item trong cart theo cartId + productId.
 * Dùng để kiểm tra sản phẩm đã có trong giỏ chưa trước khi thêm mới.
 * @returns {Object|null} Cart item nếu đã có, null nếu chưa
 */
const getByCartIdAndProductId = async (cartId, productId) => {
  return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).findOne({
    cartId: new ObjectId(cartId),
    productId: new ObjectId(productId)
  })
}

/**
 * Cập nhật cart item (thường là update quantity).
 * returnDocument: 'after' → trả về item sau khi cập nhật
 */
const updateById = async (id, data) => {
  const result = await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } },
    { returnDocument: 'after' }
  )
  return result.value || result
}

/** Xoá 1 cart item theo ID */
const deleteById = async (id) => {
  return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
}

/**
 * Xoá tất cả items trong cart (khi checkout hoặc clear cart).
 * deleteMany: xoá nhiều documents cùng lúc theo điều kiện
 */
const deleteByCartId = async (cartId) => {
  return await GET_DB()
    .collection(CART_ITEMS_COLLECTION_NAME)
    .deleteMany({ cartId: new ObjectId(cartId) })
}

export const cartItemsModel = {
  createNew,
  getAll,
  getById,
  getByCartId,
  getByCartIdAndProductId,
  updateById,
  deleteById,
  deleteByCartId
}

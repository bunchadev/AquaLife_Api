import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const CART_ITEMS_COLLECTION_NAME = 'cart_items'
const CART_ITEMS_COLLECTION_SCHEMA = Joi.object({
  cartId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  quantity: Joi.number().min(1).required()
})

const validateBeforeCreate = async (data) => CART_ITEMS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newValidData = {
      ...validData,
      cartId: new ObjectId(validData.cartId),
      productId: new ObjectId(validData.productId)
    }
    const result = await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).insertOne(newValidData)
    return result
  } catch (error) { throw new Error(error) }
}

const getAll = async () => {
  try {
    return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).find({}).toArray()
  } catch (error) { throw new Error(error) }
}

const getById = async (id) => {
  try {
    return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

const getByCartId = async (cartId) => {
  try {
    return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).find({ cartId: new ObjectId(cartId) }).toArray()
  } catch (error) { throw new Error(error) }
}

const getByCartIdAndProductId = async (cartId, productId) => {
  try {
    return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).findOne({
      cartId: new ObjectId(cartId),
      productId: new ObjectId(productId)
    })
  } catch (error) { throw new Error(error) }
}

const updateById = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: new Date()
    }
    const result = await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result.value
  } catch (error) { throw new Error(error) }
}

const deleteById = async (id) => {
  try {
    return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

const deleteByCartId = async (cartId) => {
  try {
    return await GET_DB().collection(CART_ITEMS_COLLECTION_NAME).deleteMany({ cartId: new ObjectId(cartId) })
  } catch (error) { throw new Error(error) }
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

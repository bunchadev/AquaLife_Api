import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const ORDER_DETAILS_COLLECTION_NAME = 'order_details'
const ORDER_DETAILS_COLLECTION_SCHEMA = Joi.object({
  ordersId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  productsId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  createdAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) => ORDER_DETAILS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newValidData = {
      ...validData,
      ordersId: new ObjectId(validData.ordersId),
      productsId: new ObjectId(validData.productsId)
    }
    const result = await GET_DB().collection(ORDER_DETAILS_COLLECTION_NAME).insertOne(newValidData)
    return result
  } catch (error) { throw new Error(error) }
}

const findByOrderId = async (orderId) => {
  try {
    return await GET_DB().collection(ORDER_DETAILS_COLLECTION_NAME)
      .find({ ordersId: new ObjectId(orderId) })
      .toArray()
  } catch (error) { throw new Error(error) }
}

const deleteByOrderId = async (orderId) => {
  try {
    return await GET_DB().collection(ORDER_DETAILS_COLLECTION_NAME).deleteMany({ ordersId: new ObjectId(orderId) })
  } catch (error) { throw new Error(error) }
}

const findById = async (id) => {
  try {
    return await GET_DB().collection(ORDER_DETAILS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

export const orderDetailsModel = {
  createNew,
  findByOrderId,
  deleteByOrderId,
  findById
}

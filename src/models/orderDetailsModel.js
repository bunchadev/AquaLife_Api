import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors.js'
import { ObjectId } from 'mongodb'

const ORDERDETAILS_COLLECTION_NAME = 'orderDetails'
const ORDERDETAILS_COLLECTION_SCHEMA = Joi.object({
  ordersId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  productsId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  quantity: Joi.number().integer().min(1).required(),
  priceAtOrder: Joi.number().precision(2).min(0).required(),
  subtotal: Joi.number().precision(2).min(0).optional(),
  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await ORDERDETAILS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newOrderDetailsToAdd = {
      ...validData,
      ordersId: new ObjectId(validData.ordersId),
      productsId: new ObjectId(validData.productsId)
    }
    const createOrderDetails = await GET_DB().collection(ORDERDETAILS_COLLECTION_NAME).insertOne(newOrderDetailsToAdd)
    return createOrderDetails
  } catch (error) { throw new Error(error) }
}

const findOneById = async (orderDetailsId) => {
  try {
    const result = await GET_DB().collection(ORDERDETAILS_COLLECTION_NAME).findOne({ _id: new ObjectId(orderDetailsId) })
    return result
  } catch (error) { throw new Error(error) }
}

const findByOrderId = async (orderId) => {
  try {
    const items = await GET_DB().collection(ORDERDETAILS_COLLECTION_NAME).find({ ordersId: new ObjectId(orderId) }).toArray()
    return items
  } catch (error) { throw new Error(error) }
}

export const orderDetailsModel = {
  createNew,
  findOneById
  , findByOrderId
}
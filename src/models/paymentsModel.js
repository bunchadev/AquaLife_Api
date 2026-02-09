import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const PAYMENTS_COLLECTION_NAME = 'payments'
const PAYMENTS_COLLECTION_SCHEMA = Joi.object({
  orderId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  method: Joi.string().valid('cod').required(),
  status: Joi.string().valid('Đang đợi', 'Đã thanh toán', 'Thất bại').required(),
  paidAt: Joi.date().allow(null).default(null)
})

const validateBeforeCreate = async (data) => PAYMENTS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newValidData = {
      ...validData,
      orderId: new ObjectId(validData.orderId)
    }
    return await GET_DB().collection(PAYMENTS_COLLECTION_NAME).insertOne(newValidData)
  } catch (error) { throw new Error(error) }
}

const findLatestByOrderId = async (orderId) => {
  try {
    return await GET_DB()
      .collection(PAYMENTS_COLLECTION_NAME)
      .find({ orderId: new ObjectId(orderId) })
      .sort({ createdAt: -1 })
      .limit(1)
      .next()
  } catch (error) { throw new Error(error) }
}

const updateById = async (id, data) => {
  try {
    const update = { $set: data }
    return await GET_DB().collection(PAYMENTS_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
  } catch (error) { throw new Error(error) }
}

export const paymentsModel = {
  createNew,
  findLatestByOrderId,
  updateById
}

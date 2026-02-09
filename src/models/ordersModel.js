import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const ORDERS_COLLECTION_NAME = 'orders'
const ORDERS_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  address: Joi.string().min(10).max(200).required(),
  totalPrice: Joi.number().min(0).required(),
  status: Joi.string().valid('Đang đợi', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy').default('Đang đợi').required(),
  note: Joi.string().max(500).optional(),
  createdAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) => ORDERS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newValidData = {
      ...validData,
      userId: new ObjectId(validData.userId)
    }
    const result = await GET_DB().collection(ORDERS_COLLECTION_NAME).insertOne(newValidData)
    return result
  } catch (error) { throw new Error(error) }
}

const getAll = async () => {
  try {
    return await GET_DB().collection(ORDERS_COLLECTION_NAME).find({}).sort({ createdAt: -1 }).toArray()
  } catch (error) { throw new Error(error) }
}

const findById = async (id) => {
  try {
    return await GET_DB().collection(ORDERS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

const findByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(ORDERS_COLLECTION_NAME)
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()
  } catch (error) { throw new Error(error) }
}

const updateById = async (id, data) => {
  try {
    const update = { $set: data }
    return await GET_DB().collection(ORDERS_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
  } catch (error) { throw new Error(error) }
}

const deleteById = async (id) => {
  try {
    return await GET_DB().collection(ORDERS_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

export const ordersModel = {
  createNew,
  getAll,
  findById,
  findByUserId,
  updateById,
  deleteById
}

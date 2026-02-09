import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const CARTS_COLLECTION_NAME = 'carts'
const CARTS_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  createdAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) => CARTS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newValidData = {
      ...validData,
      userId: new ObjectId(validData.userId)
    }
    const result = await GET_DB().collection(CARTS_COLLECTION_NAME).insertOne(newValidData)
    return result
  } catch (error) { throw new Error(error) }
}

const getAll = async () => {
  try {
    return await GET_DB().collection(CARTS_COLLECTION_NAME).find({}).toArray()
  } catch (error) { throw new Error(error) }
}

const getById = async (id) => {
  try {
    return await GET_DB().collection(CARTS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

const getByUserId = async (userId) => {
  try {
    return await GET_DB().collection(CARTS_COLLECTION_NAME).findOne({ userId: new ObjectId(userId) })
  } catch (error) { throw new Error(error) }
}

const updateById = async (id, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: new Date()
    }
    const result = await GET_DB().collection(CARTS_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result.value
  } catch (error) { throw new Error(error) }
}

const deleteById = async (id) => {
  try {
    return await GET_DB().collection(CARTS_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

export const cartsModel = {
  createNew,
  getAll,
  getById,
  getByUserId,
  updateById,
  deleteById
}

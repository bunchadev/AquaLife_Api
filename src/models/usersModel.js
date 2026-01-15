import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const USERS_COLLECTION_NAME = 'users'
const USERS_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(10).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  address: Joi.string().min(10).max(200).required(),
  role: Joi.string().valid('customer', 'admin').default('customer'),
  status: Joi.string().valid('active', 'inactive').default('active'),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) => USERS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const createUser = await GET_DB().collection(USERS_COLLECTION_NAME).insertOne(validData)
    return createUser
  } catch (error) { throw new Error(error) }
}

const getAll = async () => {
  try {
    return await GET_DB().collection(USERS_COLLECTION_NAME).find({}).toArray()
  } catch (error) { throw new Error(error) }
}

const findById = async (id) => {
  try {
    return await GET_DB().collection(USERS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

const findByEmail = async (email) => {
  try {
    return await GET_DB().collection(USERS_COLLECTION_NAME).findOne({ email })
  } catch (error) { throw new Error(error) }
}

const updateById = async (id, data) => {
  try {
    const update = { $set: { ...data, updatedAt: new Date() } }
    return await GET_DB().collection(USERS_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
  } catch (error) { throw new Error(error) }
}

const deleteById = async (id) => {
  try {
    return await GET_DB().collection(USERS_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
  } catch (error) { throw new Error(error) }
}

export const usersModel = {
  createNew,
  getAll,
  findById,
  findByEmail,
  updateById,
  deleteById
}
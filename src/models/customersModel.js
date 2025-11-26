import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { PHONE_RULE, PHONE_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors.js'
import { ObjectId } from 'mongodb'

const CUSTOMERS_COLLECTION_NAME = 'customers'
const CUSTOMERS_COLLECTION_SCHEMA = Joi.object({
  branchesId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phone: Joi.string().pattern(PHONE_RULE).message(PHONE_RULE_MESSAGE),
  address: Joi.string().min(10).max(255),
  password: Joi.string().min(10).max(100).required(),
  image: Joi.string().uri().default(''),
  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await CUSTOMERS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newCustomerToAdd = {
      ...validData,
      branchesId: new ObjectId(validData.branchesId)
    }
    const createCustomers = await GET_DB().collection(CUSTOMERS_COLLECTION_NAME).insertOne(newCustomerToAdd)
    return createCustomers
  } catch (error) { throw new Error(error) }
}

const getAll = async () => {
  try {
    // exclude password field from returned documents
    const items = await GET_DB().collection(CUSTOMERS_COLLECTION_NAME).find({}, { projection: { password: 0 } }).toArray()
    return items
  } catch (error) { throw new Error(error) }
}

const findById = async (id) => {
  try {
    const item = await GET_DB().collection(CUSTOMERS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })
    return item
  } catch (error) { throw new Error(error) }
}

const updateById = async (id, data) => {
  try {
    const update = { $set: { ...data, updatedAt: Date.now() } }
    const result = await GET_DB().collection(CUSTOMERS_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
    return result
  } catch (error) { throw new Error(error) }
}

const deleteById = async (id) => {
  try {
    const result = await GET_DB().collection(CUSTOMERS_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) { throw new Error(error) }
}

const deleteAll = async () => {
  try {
    const result = await GET_DB().collection(CUSTOMERS_COLLECTION_NAME).deleteMany({})
    return result
  } catch (error) { throw new Error(error) }
}

const findByEmail = async (email) => {
  try {
    const customer = await GET_DB().collection(CUSTOMERS_COLLECTION_NAME).findOne({ email })
    return customer
  } catch (error) { throw new Error(error) }
}

export const customersModel = {
  createNew,
  getAll,
  findById,
  updateById,
  deleteById,
  deleteAll,
  findByEmail
}
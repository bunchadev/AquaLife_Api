import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, PHONE_RULE, PHONE_RULE_MESSAGE } from '~/utils/validatiors.js'
import { ObjectId } from 'mongodb'

const EMPLOYEES_COLLECTION_NAME = 'employees'
const EMPLOYEES_COLLECTION_SCHEMA = Joi.object({
  branchesId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  phone: Joi.string().pattern(PHONE_RULE).message(PHONE_RULE_MESSAGE),
  role: Joi.string().valid('Chủ', 'Quản lý', 'Nhân viên').required(),
  password: Joi.string().min(6).required(),
  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await EMPLOYEES_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newEmployeeToAdd = {
      ...validData,
      branchesId: new ObjectId(validData.branchesId)
    }

    // only convert branchesId to ObjectId if provided
    if (validData.branchesId) {
      newEmployeeToAdd.branchesId = new ObjectId(validData.branchesId)
    }
    const createBranches = await GET_DB().collection(EMPLOYEES_COLLECTION_NAME).insertOne(newEmployeeToAdd)
    return createBranches
  } catch (error) { throw new Error(error) }
}

const getAll = async () => {
  return await GET_DB().collection(EMPLOYEES_COLLECTION_NAME).find({}).toArray()
}

const getById = async (id) => {
  return await GET_DB().collection(EMPLOYEES_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
}

const updateById = async (id, data) => {
  try {
    const update = { $set: { ...data, updatedAt: Date.now() } }
    const result = await GET_DB().collection(EMPLOYEES_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, update)
    return result
  } catch (error) { throw new Error(error) }
}

const deleteById = async (id) => {
  try {
    const result = await GET_DB().collection(EMPLOYEES_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) { throw new Error(error) }
}

const deleteAll = async () => {
  try {
    const result = await GET_DB().collection(EMPLOYEES_COLLECTION_NAME).deleteMany({})
    return result
  } catch (error) { throw new Error(error) }
}

export const employeesModel = {
  createNew,
  getAll,
  getById,
  updateById,
  deleteById,
  deleteAll
}
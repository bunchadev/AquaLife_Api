import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { PHONE_RULE, PHONE_RULE_MESSAGE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors.js'
import { ObjectId } from 'mongodb'

const HEADQUATER_COLLECTION_NAME = 'headquater'
const HEADQUATER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(10).max(255).required(),
  phone: Joi.string().pattern(PHONE_RULE).message(PHONE_RULE_MESSAGE),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  branchesId: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await HEADQUATER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newHeadquaterToAdd = {
      ...validData,
      branchesId: validData.branchesId.map(id => new ObjectId(id))
    }
    const createHeadquater = await GET_DB().collection(HEADQUATER_COLLECTION_NAME).insertOne(newHeadquaterToAdd)
    return createHeadquater
  } catch (error) { throw new Error(error) }
}


const getInfo = async () => {
  try {
    const item = await GET_DB().collection(HEADQUATER_COLLECTION_NAME).findOne({}, { projection: { } })
    return item
  } catch (error) { throw new Error(error) }
}


export const headquaterModel = {
  createNew
  , getInfo
}
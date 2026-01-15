import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const FISH_DETAILS_COLLECTION_NAME = 'fish_details'
const FISH_DETAILS_SCHEMA = Joi.object({
  product_id: Joi.string().required(),
  size_cm: Joi.number().min(0).optional(),
  age_month: Joi.number().min(0).optional(),
  color: Joi.string().optional(),
  origin: Joi.string().optional(),
  temperament: Joi.string().valid('hiền', 'hung dữ').optional(),
  care_level: Joi.string().valid('dễ', 'trung bình', 'khó').optional()
})

const validateBeforeCreate = async (data) => FISH_DETAILS_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(FISH_DETAILS_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) { throw new Error(error) }
}

const findByProductId = async (productId) => {
  try {
    return await GET_DB().collection(FISH_DETAILS_COLLECTION_NAME).findOne({ product_id: productId })
  } catch (error) { throw new Error(error) }
}

const updateByProductId = async (productId, data) => {
  try {
    const update = { $set: data }
    return await GET_DB().collection(FISH_DETAILS_COLLECTION_NAME).updateOne({ product_id: productId }, update, { upsert: true })
  } catch (error) { throw new Error(error) }
}

const deleteByProductId = async (productId) => {
  try {
    return await GET_DB().collection(FISH_DETAILS_COLLECTION_NAME).deleteOne({ product_id: productId })
  } catch (error) { throw new Error(error) }
}

export const fishDetailsModel = {
  createNew,
  findByProductId,
  updateByProductId,
  deleteByProductId
}

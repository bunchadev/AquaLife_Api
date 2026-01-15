import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const PLANT_DETAILS_COLLECTION_NAME = 'plant_details'
const PLANT_DETAILS_SCHEMA = Joi.object({
  product_id: Joi.string().required(),
  light_requirement: Joi.string().optional(),
  co2_requirement: Joi.string().optional(),
  growth_rate: Joi.string().optional(),
  care_level: Joi.string().valid('dễ', 'trung bình', 'khó').optional()
})

const validateBeforeCreate = async (data) => PLANT_DETAILS_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(PLANT_DETAILS_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) { throw new Error(error) }
}

const findByProductId = async (productId) => {
  try {
    return await GET_DB().collection(PLANT_DETAILS_COLLECTION_NAME).findOne({ product_id: productId })
  } catch (error) { throw new Error(error) }
}

const updateByProductId = async (productId, data) => {
  try {
    const update = { $set: data }
    return await GET_DB().collection(PLANT_DETAILS_COLLECTION_NAME).updateOne({ product_id: productId }, update, { upsert: true })
  } catch (error) { throw new Error(error) }
}

const deleteByProductId = async (productId) => {
  try {
    return await GET_DB().collection(PLANT_DETAILS_COLLECTION_NAME).deleteOne({ product_id: productId })
  } catch (error) { throw new Error(error) }
}

export const plantDetailsModel = {
  createNew,
  findByProductId,
  updateByProductId,
  deleteByProductId
}

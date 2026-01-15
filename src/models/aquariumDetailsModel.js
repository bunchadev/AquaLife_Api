import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const AQUARIUM_DETAILS_COLLECTION_NAME = 'aquarium_details'
const AQUARIUM_DETAILS_SCHEMA = Joi.object({
  product_id: Joi.string().required(),
  volume_liters: Joi.number().min(0).optional(),
  dimensions: Joi.string().optional(),
  glass_type: Joi.string().optional(),
  suitable_for: Joi.string().optional()
})

const validateBeforeCreate = async (data) => AQUARIUM_DETAILS_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(AQUARIUM_DETAILS_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) { throw new Error(error) }
}

const findByProductId = async (productId) => {
  try {
    return await GET_DB().collection(AQUARIUM_DETAILS_COLLECTION_NAME).findOne({ product_id: productId })
  } catch (error) { throw new Error(error) }
}

const updateByProductId = async (productId, data) => {
  try {
    const update = { $set: data }
    return await GET_DB().collection(AQUARIUM_DETAILS_COLLECTION_NAME).updateOne({ product_id: productId }, update, { upsert: true })
  } catch (error) { throw new Error(error) }
}

const deleteByProductId = async (productId) => {
  try {
    return await GET_DB().collection(AQUARIUM_DETAILS_COLLECTION_NAME).deleteOne({ product_id: productId })
  } catch (error) { throw new Error(error) }
}

export const aquariumDetailsModel = {
  createNew,
  findByProductId,
  updateByProductId,
  deleteByProductId
}

import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const CARE_GUIDES_COLLECTION_NAME = 'care_guides'
const CARE_GUIDES_SCHEMA = Joi.object({
  product_id: Joi.string().required(),
  water_temperature: Joi.string().optional(),
  ph_level: Joi.string().optional(),
  lighting: Joi.string().optional(),
  feeding: Joi.string().optional(),
  notes: Joi.string().optional()
})

const validateBeforeCreate = async (data) => CARE_GUIDES_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection(CARE_GUIDES_COLLECTION_NAME).insertOne(validData)
    return result
  } catch (error) { throw new Error(error) }
}

const findByProductId = async (productId) => {
  try {
    return await GET_DB().collection(CARE_GUIDES_COLLECTION_NAME).findOne({ product_id: productId })
  } catch (error) { throw new Error(error) }
}

const updateByProductId = async (productId, data) => {
  try {
    const update = { $set: data }
    return await GET_DB().collection(CARE_GUIDES_COLLECTION_NAME).updateOne({ product_id: productId }, update, { upsert: true })
  } catch (error) { throw new Error(error) }
}

const deleteByProductId = async (productId) => {
  try {
    return await GET_DB().collection(CARE_GUIDES_COLLECTION_NAME).deleteOne({ product_id: productId })
  } catch (error) { throw new Error(error) }
}

export const careGuidesModel = {
  createNew,
  findByProductId,
  updateByProductId,
  deleteByProductId
}

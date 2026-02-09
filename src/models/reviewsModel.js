import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const REVIEWS_COLLECTION_NAME = 'reviews'

const REVIEWS_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('').max(500).default(''),
  createdAt: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) => REVIEWS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newValidData = {
      ...validData,
      userId: new ObjectId(validData.userId),
      productId: new ObjectId(validData.productId)
    }
    const result = await GET_DB().collection(REVIEWS_COLLECTION_NAME).insertOne(newValidData)
    return await GET_DB().collection(REVIEWS_COLLECTION_NAME).findOne({ _id: result.insertedId })
  } catch (error) { throw new Error(error) }
}

const findByProductId = async (productId) => {
  try {
    return await GET_DB().collection(REVIEWS_COLLECTION_NAME)
      .find({ productId: new ObjectId(productId) })
      .sort({ createdAt: -1 })
      .toArray()
  } catch (error) { throw new Error(error) }
}

const findByUserAndProduct = async (userId, productId) => {
  try {
    return await GET_DB().collection(REVIEWS_COLLECTION_NAME).findOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId)
    })
  } catch (error) { throw new Error(error) }
}

export const reviewsModel = {
  createNew,
  findByProductId,
  findByUserAndProduct
}

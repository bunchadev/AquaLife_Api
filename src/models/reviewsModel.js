import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors.js'
import { ObjectId } from 'mongodb'

const REVIEWS_COLLECTION_NAME = 'reviews'
const REVIEWS_COLLECTION_SCHEMA = Joi.object({
  productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  customerId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('').max(1000).optional(),
  created_at: Joi.date().timestamp('javascript').default(Date.now),
  updated_at: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await REVIEWS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const prodId = new ObjectId(validData.productId)
    const custId = new ObjectId(validData.customerId)

    // prevent duplicate review by same customer for same product
    const existing = await GET_DB().collection(REVIEWS_COLLECTION_NAME).findOne({ product_id: prodId, customer_id: custId })
    if (existing) throw new Error('Customer has already reviewed this product')

    const toInsert = {
      product_id: prodId,
      customer_id: custId,
      rating: validData.rating,
      comment: validData.comment || '',
      created_at: Date.now(),
      updated_at: Date.now()
    }
    const result = await GET_DB().collection(REVIEWS_COLLECTION_NAME).insertOne(toInsert)
    return result
  } catch (error) { throw new Error(error) }
}

const getByProductId = async (productId) => {
  try {
    const pid = new ObjectId(productId)
    const pipeline = [
      { $match: { product_id: pid } },
      { $sort: { created_at: -1 } },
      { $lookup: {
          from: 'customers',
          localField: 'customer_id',
          foreignField: '_id',
          as: 'customer'
      }},
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      { $project: {
          rating: 1,
          comment: 1,
          created_at: 1,
          updated_at: 1,
          customer_id: 1,
          customer_name: '$customer.name',
          customer_image: '$customer.image'
      }}
    ]

    const items = await GET_DB().collection(REVIEWS_COLLECTION_NAME).aggregate(pipeline).toArray()
    return items
  } catch (error) { throw new Error(error) }
}

const getAll = async () => {
  try {
    const items = await GET_DB().collection(REVIEWS_COLLECTION_NAME).find({}).toArray()
    return items
  } catch (error) { throw new Error(error) }
}

export const reviewsModel = {
  createNew,
  getByProductId,
  getAll
}

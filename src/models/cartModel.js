import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const CART_COLLECTION_NAME = 'cart'
const CART_SCHEMA = Joi.object({
  user_id: Joi.string().required(),
  created_at: Joi.date().default(() => new Date())
})

const validateBeforeCreate = async (data) => CART_SCHEMA.validateAsync(data, { abortEarly: false })

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const result = await GET_DB().collection('cart').insertOne(validData)
    return result
  } catch (error) { throw new Error(error) }
}

const findByUserId = async (userId) => {
  try {
    return await GET_DB().collection('cart').findOne({ user_id: userId })
  } catch (error) { throw new Error(error) }
}

const deleteByUserId = async (userId) => {
  try {
    return await GET_DB().collection('cart').deleteOne({ user_id: userId })
  } catch (error) { throw new Error(error) }
}

export const cartModel = {
  createNew: async (data) => {
    try {
      return await GET_DB().collection('cart').insertOne(data)
    } catch (error) { throw new Error(error) }
  },
  findByUserId: async (userId) => {
    try {
      return await GET_DB().collection('cart').findOne({ user_id: userId })
    } catch (error) { throw new Error(error) }
  },
  deleteByUserId: async (userId) => {
    try {
      return await GET_DB().collection('cart').deleteOne({ user_id: userId })
    } catch (error) { throw new Error(error) }
  }
}

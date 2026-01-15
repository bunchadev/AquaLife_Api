import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

export const reviewsModel = {
  createNew: async (data) => {
    try {
      return await GET_DB().collection('reviews').insertOne({
        ...data,
        created_at: new Date()
      })
    } catch (error) { throw new Error(error) }
  },
  getAll: async () => {
    try {
      return await GET_DB().collection('reviews').find({}).toArray()
    } catch (error) { throw new Error(error) }
  },
  findByProductId: async (productId) => {
    try {
      return await GET_DB().collection('reviews').find({ product_id: productId }).toArray()
    } catch (error) { throw new Error(error) }
  },
  findByUserId: async (userId) => {
    try {
      return await GET_DB().collection('reviews').find({ user_id: userId }).toArray()
    } catch (error) { throw new Error(error) }
  },
  deleteById: async (id) => {
    try {
      return await GET_DB().collection('reviews').deleteOne({ _id: new ObjectId(id) })
    } catch (error) { throw new Error(error) }
  }
}

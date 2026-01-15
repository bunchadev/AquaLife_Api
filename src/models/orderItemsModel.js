import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

export const orderItemsModel = {
  createNew: async (data) => {
    try {
      return await GET_DB().collection('order_items').insertOne(data)
    } catch (error) { throw new Error(error) }
  },
  findByOrderId: async (orderId) => {
    try {
      return await GET_DB().collection('order_items').find({ order_id: orderId }).toArray()
    } catch (error) { throw new Error(error) }
  },
  deleteByOrderId: async (orderId) => {
    try {
      return await GET_DB().collection('order_items').deleteMany({ order_id: orderId })
    } catch (error) { throw new Error(error) }
  }
}

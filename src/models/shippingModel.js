import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

export const shippingModel = {
  createNew: async (data) => {
    try {
      return await GET_DB().collection('shipping').insertOne(data)
    } catch (error) { throw new Error(error) }
  },
  findByOrderId: async (orderId) => {
    try {
      return await GET_DB().collection('shipping').findOne({ order_id: orderId })
    } catch (error) { throw new Error(error) }
  },
  updateStatus: async (orderId, status) => {
    try {
      return await GET_DB().collection('shipping').updateOne(
        { order_id: orderId },
        { $set: { shipping_status: status } }
      )
    } catch (error) { throw new Error(error) }
  },
  deleteByOrderId: async (orderId) => {
    try {
      return await GET_DB().collection('shipping').deleteOne({ order_id: orderId })
    } catch (error) { throw new Error(error) }
  }
}

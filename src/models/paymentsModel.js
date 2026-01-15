import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

export const paymentsModel = {
  createNew: async (data) => {
    try {
      return await GET_DB().collection('payments').insertOne({
        ...data,
        payment_date: new Date()
      })
    } catch (error) { throw new Error(error) }
  },
  findByOrderId: async (orderId) => {
    try {
      return await GET_DB().collection('payments').findOne({ order_id: orderId })
    } catch (error) { throw new Error(error) }
  },
  updateStatus: async (orderId, status) => {
    try {
      return await GET_DB().collection('payments').updateOne(
        { order_id: orderId },
        { $set: { payment_status: status } }
      )
    } catch (error) { throw new Error(error) }
  },
  deleteByOrderId: async (orderId) => {
    try {
      return await GET_DB().collection('payments').deleteOne({ order_id: orderId })
    } catch (error) { throw new Error(error) }
  }
}

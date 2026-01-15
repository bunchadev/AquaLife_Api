import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

export const ordersModel = {
  createNew: async (data) => {
    try {
      return await GET_DB().collection('orders').insertOne({
        ...data,
        order_date: new Date()
      })
    } catch (error) { throw new Error(error) }
  },
  getAll: async () => {
    try {
      return await GET_DB().collection('orders').find({}).toArray()
    } catch (error) { throw new Error(error) }
  },
  findById: async (id) => {
    try {
      return await GET_DB().collection('orders').findOne({ _id: new ObjectId(id) })
    } catch (error) { throw new Error(error) }
  },
  findByUserId: async (userId) => {
    try {
      return await GET_DB().collection('orders').find({ user_id: userId }).toArray()
    } catch (error) { throw new Error(error) }
  },
  updateStatus: async (id, status) => {
    try {
      return await GET_DB().collection('orders').updateOne(
        { _id: new ObjectId(id) },
        { $set: { order_status: status } }
      )
    } catch (error) { throw new Error(error) }
  },
  deleteById: async (id) => {
    try {
      return await GET_DB().collection('orders').deleteOne({ _id: new ObjectId(id) })
    } catch (error) { throw new Error(error) }
  }
}

import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

export const cartItemsModel = {
  createNew: async (data) => {
    try {
      return await GET_DB().collection('cart_items').insertOne(data)
    } catch (error) { throw new Error(error) }
  },
  findByCartId: async (cartId) => {
    try {
      return await GET_DB().collection('cart_items').find({ cart_id: cartId }).toArray()
    } catch (error) { throw new Error(error) }
  },
  updateQuantity: async (cartItemId, quantity) => {
    try {
      return await GET_DB().collection('cart_items').updateOne(
        { _id: new ObjectId(cartItemId) },
        { $set: { quantity } }
      )
    } catch (error) { throw new Error(error) }
  },
  deleteById: async (id) => {
    try {
      return await GET_DB().collection('cart_items').deleteOne({ _id: new ObjectId(id) })
    } catch (error) { throw new Error(error) }
  },
  deleteByCartId: async (cartId) => {
    try {
      return await GET_DB().collection('cart_items').deleteMany({ cart_id: cartId })
    } catch (error) { throw new Error(error) }
  }
}

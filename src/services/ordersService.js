import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { ordersModel } from '~/models/ordersModel.js'

const createNew = async (data, user) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const userId = data?.userId || user?.id
    if (!userId) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Missing userId')
    }
    const rawStatus = Array.isArray(data?.status) ? data.status[0] : data?.status
    const normalizedStatus = rawStatus === 'pending' ? 'Đang đợi' : (rawStatus || 'Đang đợi')

    return await ordersModel.createNew({
      userId,
      address: data?.address,
      totalPrice: Number(data.totalPrice || 0),
      status: normalizedStatus,
      note: data?.note
    })
  } catch (error) { throw error }
}

const getAll = async (user) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (user?.role === 'admin') return await ordersModel.getAll()
    if (!user?.id) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
    return await ordersModel.findByUserId(String(user.id))
  } catch (error) { throw error }
}

const findById = async (id, user) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const order = await ordersModel.findById(id)
    if (!order) return null

    if (user?.role !== 'admin' && String(order.userId) !== String(user?.id)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied')
    }

    return order
  } catch (error) { throw error }
}

const updateById = async (id, data, user) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const existing = await ordersModel.findById(id)
    if (!existing) return null

    if (user?.role !== 'admin' && String(existing.userId) !== String(user?.id)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied')
    }

    await ordersModel.updateById(id, data)
    return await ordersModel.findById(id)
  } catch (error) { throw error }
}

const deleteById = async (id, user) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const existing = await ordersModel.findById(id)
    if (!existing) return null

    if (user?.role !== 'admin' && String(existing.userId) !== String(user?.id)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied')
    }

    return await ordersModel.deleteById(id)
  } catch (error) { throw error }
}

export const ordersService = {
  createNew,
  getAll,
  findById,
  updateById,
  deleteById
}

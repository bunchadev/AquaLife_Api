import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { ordersModel } from '~/models/ordersModel.js'
import { paymentsModel } from '~/models/paymentsModel.js'

const createNew = async (data, user) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const orderId = data?.orderId
    if (!orderId) throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Missing orderId')

    const order = await ordersModel.findById(orderId)
    if (!order) throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found')

    if (user?.role !== 'admin' && String(order.userId) !== String(user?.id)) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Access denied')
    }

    const latestPayment = await paymentsModel.findLatestByOrderId(orderId)
    if (latestPayment?.status === 'Đã thanh toán') {
      throw new ApiError(StatusCodes.CONFLICT, 'Order already paid')
    }

    const payment = await paymentsModel.createNew({
      orderId,
      method: 'cod',
      status: 'Đã thanh toán',
      paidAt: new Date()
    })

    await ordersModel.updateById(String(orderId), { status: 'Đang đợi' })

    return payment
  } catch (error) { throw error }
}

export const paymentsService = {
  createNew
}

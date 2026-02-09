import { StatusCodes } from 'http-status-codes'
import { orderDetailsService } from '~/services/orderDetailsService'

const createNew = async (req, res, next) => {
  try {
    const result = await orderDetailsService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const { orderId } = req.query
    if (!orderId) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'orderId is required' })
    const items = await orderDetailsService.findByOrderId(orderId)
    res.status(StatusCodes.OK).json(items)
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const item = await orderDetailsService.findById(id)
    if (!item) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })
    res.status(StatusCodes.OK).json(item)
  } catch (error) { next(error) }
}

export const orderDetailsController = {
  createNew,
  getAll,
  getById
}

import { StatusCodes } from 'http-status-codes'
import { orderDetailsService } from '~/services/orderDetailsService'

const createNew = async (req, res, next) => {

  try {
    const createOrderDetails = await orderDetailsService.createNew(req.body)
    // convert ObjectId fields to strings for client
    const out = { ...createOrderDetails }
    try {
      if (out._id) out._id = out._id.toString()
      if (out.ordersId) out.ordersId = out.ordersId.toString()
      if (out.productsId) out.productsId = out.productsId.toString()
    } catch (e) { /* ignore */ }
    res.status(StatusCodes.CREATED).json(out)
  } catch (error) { next(error) }
}

const getByOrderId = async (req, res, next) => {
  try {
    const orderId = req.query.orderId || req.params.orderId
    if (!orderId) return res.status(400).json({ message: 'orderId is required' })
    const items = await orderDetailsService.findByOrderId(orderId)
    // convert ObjectId fields to strings so frontend can use them directly
    const mapped = (items || []).map((it) => {
      const o = { ...it }
      try {
        if (o._id) o._id = o._id.toString()
        if (o.ordersId) o.ordersId = o.ordersId.toString()
        if (o.productsId) o.productsId = o.productsId.toString()
      } catch (e) {}
      return o
    })
    res.status(200).json(mapped)
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const item = await orderDetailsService.findOneById(id)
    if (!item) return res.status(404).json({ message: 'Not found' })
    const out = { ...item }
    try {
      if (out._id) out._id = out._id.toString()
      if (out.ordersId) out.ordersId = out.ordersId.toString()
      if (out.productsId) out.productsId = out.productsId.toString()
    } catch (e) {}
    res.status(200).json(out)
  } catch (error) { next(error) }
}

export const orderDetailsController = {
  createNew
  , getByOrderId
  , getById
}

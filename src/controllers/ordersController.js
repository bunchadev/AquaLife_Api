import { StatusCodes } from 'http-status-codes'
import { ordersService } from '~/services/ordersService'
import { authorize } from '~/middlewares/authorizeMiddleware'

const createNew = async (req, res, next) => {

  try {
    const createOrders = await ordersService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createOrders)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    // if requester is a customer, return only their orders
    const requester = req.user || {}
    if (requester.role && !['admin', 'manager'].includes(requester.role)) {
      const requesterId = requester.id || requester._id || requester.userId
      const items = await ordersService.findByCustomerId(requesterId)
      return res.status(200).json(items)
    }

    // admin/manager: return all orders
    const items = await ordersService.getAll()
    res.status(200).json(items)
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const order = await ordersService.findById(id)
    if (!order) return res.status(404).json({ message: 'Not found' })

    const requester = req.user || {}
    if (requester.role && !['admin', 'manager'].includes(requester.role)) {
      const requesterId = requester.id || requester._id || requester.userId
      if (String(order.customersId) !== String(requesterId)) {
        return res.status(403).json({ message: 'Forbidden' })
      }
    }

    res.status(200).json(order)
  } catch (error) { next(error) }
}

const updateById = async (req, res, next) => {
  try {
    const id = req.params.id
    // Only admin/manager should call this (route will enforce)
    const updated = await ordersService.updateById(id, req.body)
    res.status(200).json(updated)
  } catch (error) { next(error) }
}

export const ordersController = {
  createNew
  , getAll
  , getById
  , updateById
}

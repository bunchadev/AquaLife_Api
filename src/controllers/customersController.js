import { StatusCodes } from 'http-status-codes'
import { customersService } from '~/services/customersService'

const createNew = async (req, res, next) => {

  try {
    const createCustomers = await customersService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createCustomers)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const items = await customersService.getAll()
    res.status(StatusCodes.OK).json(items)
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    // allow admin/manager to fetch any customer
    const requester = req.user || {}
    if (!requester.role) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }
    if (!['admin', 'manager'].includes(requester.role)) {
      // if not admin/manager, allow only if requester is the same customer
      const requesterId = requester.id || requester._id || requester.userId
      if (!requesterId || String(requesterId) !== String(id)) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
      }
    }

    const item = await customersService.getById(id)
    res.status(StatusCodes.OK).json(item)
  } catch (error) { next(error) }
}

const updateById = async (req, res, next) => {
  try {
    const id = req.params.id
    const requester = req.user || {}

    if (!requester.role) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }

    // allow admin/manager to update any customer
    if (!['admin', 'manager'].includes(requester.role)) {
      // non-admins may only update their own profile
      const requesterId = requester.id || requester._id || requester.userId
      if (!requesterId || String(requesterId) !== String(id)) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' })
      }
    }

    const result = await customersService.updateById(id, req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const deleteById = async (req, res, next) => {
  try {
    const result = await customersService.deleteById(req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const deleteAll = async (req, res, next) => {
  try {
    const result = await customersService.deleteAll()
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const customersController = {
  createNew
  , getAll
  , getById
  , updateById
  , deleteById
  , deleteAll
}

import { StatusCodes } from 'http-status-codes'
import { ordersService } from '~/services/ordersService'

const createNew = async (req, res, next) => {
  try {
    const result = await ordersService.createNew(req.body, req.user)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const items = await ordersService.getAll(req.user)
    res.status(StatusCodes.OK).json(items)
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const item = await ordersService.findById(id, req.user)
    if (!item) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })
    res.status(StatusCodes.OK).json(item)
  } catch (error) { next(error) }
}

const updateById = async (req, res, next) => {
  try {
    const id = req.params.id
    const updated = await ordersService.updateById(id, req.body, req.user)
    if (!updated) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })
    res.status(StatusCodes.OK).json(updated)
  } catch (error) { next(error) }
}

const deleteById = async (req, res, next) => {
  try {
    const id = req.params.id
    const result = await ordersService.deleteById(id, req.user)
    if (!result) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })
    res.status(StatusCodes.NO_CONTENT).end()
  } catch (error) { next(error) }
}

export const ordersController = {
  createNew,
  getAll,
  getById,
  updateById,
  deleteById
}

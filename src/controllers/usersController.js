import { StatusCodes } from 'http-status-codes'
import { usersService } from '~/services/usersService'

const createNew = async (req, res, next) => {
  try {
    const user = await usersService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(user)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const result = await usersService.login(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const items = await usersService.getAll()
    res.status(StatusCodes.OK).json(items)
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const item = await usersService.findById(id)
    if (!item) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })
    res.status(StatusCodes.OK).json(item)
  } catch (error) { next(error) }
}

const updateById = async (req, res, next) => {
  try {
    const id = req.params.id
    const updated = await usersService.updateById(id, req.body)
    res.status(StatusCodes.OK).json(updated)
  } catch (error) { next(error) }
}

const deleteById = async (req, res, next) => {
  try {
    const id = req.params.id
    await usersService.deleteById(id)
    res.status(StatusCodes.NO_CONTENT).end()
  } catch (error) { next(error) }
}

export const usersController = {
  createNew,
  login,
  getAll,
  getById,
  updateById,
  deleteById
}
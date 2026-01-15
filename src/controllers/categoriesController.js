import { StatusCodes } from 'http-status-codes'
import { categoriesService } from '~/services/categoriesService'

const createNew = async (req, res, next) => {
  try {
    const result = await categoriesService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const items = await categoriesService.getAll()
    res.status(StatusCodes.OK).json(items)
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const item = await categoriesService.findById(id)
    if (!item) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })
    res.status(StatusCodes.OK).json(item)
  } catch (error) { next(error) }
}

const updateById = async (req, res, next) => {
  try {
    const id = req.params.id
    const updated = await categoriesService.updateById(id, req.body)
    res.status(StatusCodes.OK).json(updated)
  } catch (error) { next(error) }
}

const deleteById = async (req, res, next) => {
  try {
    const id = req.params.id
    await categoriesService.deleteById(id)
    res.status(StatusCodes.NO_CONTENT).end()
  } catch (error) { next(error) }
}

export const categoriesController = {
  createNew,
  getAll,
  getById,
  updateById,
  deleteById
}

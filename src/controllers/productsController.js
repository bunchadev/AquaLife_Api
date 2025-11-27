import { StatusCodes } from 'http-status-codes'
import { productsService } from '~/services/productsService'
import { productsModel } from '~/models/productsModel'

const createNew = async (req, res, next) => {

  try {
    const createProducts = await productsService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createProducts)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const items = await productsService.getAll()
    res.status(200).json(items)
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const item = await productsService.findById(id)
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.status(200).json(item)
  } catch (error) { next(error) }
}

const updateById = async (req, res, next) => {
  try {
    const id = req.params.id
    await productsService.updateById(id, req.body)
    const updated = await productsModel.findById(id)
    res.status(200).json(updated)
  } catch (error) { next(error) }
}

const deleteById = async (req, res, next) => {
  try {
    const id = req.params.id
    await productsService.deleteById(id)
    res.status(204).end()
  } catch (error) { next(error) }
}

const deleteAll = async (req, res, next) => {
  try {
    const result = await productsService.deleteAll()
    res.status(200).json(result)
  } catch (error) { next(error) }
}

export const productsController = {
  createNew,
  getAll,
  getById,
  updateById,
  deleteById,
  deleteAll
}

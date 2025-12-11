import { StatusCodes } from 'http-status-codes'
import { promosService } from '~/services/promosService'

const createNew = async (req, res, next) => {
  try {
    const createPromos = await promosService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createPromos)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const items = await promosService.getAll()
    res.status(200).json(items)
  } catch (error) { next(error) }
}

const validatePromo = async (req, res, next) => {
  try {
    const { code, total } = req.body
    const result = await promosService.validatePromo(code, total)
    res.status(200).json(result)
  } catch (error) { next(error) }
}

export const promosController = {
  createNew,
  getAll,
  validatePromo
}
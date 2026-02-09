import { StatusCodes } from 'http-status-codes'
import { paymentsService } from '~/services/paymentsService'

const createNew = async (req, res, next) => {
  try {
    const result = await paymentsService.createNew(req.body, req.user)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) { next(error) }
}

export const paymentsController = {
  createNew
}

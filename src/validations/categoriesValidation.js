import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const correctCondition = Joi.object({
  name: Joi.string().required().messages({
    'any.required': '"name" is required.'
  }),
  description: Joi.string().optional().messages({
    'string.base': '"description" must be a string.'
  })
})

const createNew = async (req, res, next) => {
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateById = async (req, res, next) => {
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const categoriesValidation = {
  createNew,
  updateById
}

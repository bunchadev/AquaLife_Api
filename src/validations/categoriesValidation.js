import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const categorySchema = Joi.object({
  category_name: Joi.string().required().messages({
    'any.required': '"category_name" is required.'
  }),
  category_type: Joi.string().valid('fish', 'aquarium', 'accessory', 'food', 'plant').required().messages({
    'any.only': '"category_type" must be one of [fish, aquarium, accessory, food, plant].',
    'any.required': '"category_type" is required.'
  }),
  description: Joi.string().optional()
})

const createNew = async (req, res, next) => {
  try {
    await categorySchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateById = async (req, res, next) => {
  try {
    await categorySchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const categoriesValidation = {
  createNew,
  updateById
}

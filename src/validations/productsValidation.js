import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    product_name: Joi.string().required().messages({
      'any.required': '"product_name" is required.'
    }),
    product_type: Joi.string().valid('fish', 'aquarium', 'accessory', 'food', 'plant').required().messages({
      'any.only': '"product_type" must be one of [fish, aquarium, accessory, food, plant].',
      'any.required': '"product_type" is required.'
    }),
    category_id: Joi.string().optional(),
    price: Joi.number().min(0).required().messages({
      'number.min': '"price" must be greater than or equal to 0.',
      'any.required': '"price" is required.'
    }),
    stock_quantity: Joi.number().integer().min(0).optional(),
    description: Joi.string().optional(),
    image_url: Joi.string().optional(),
    status: Joi.string().valid('available', 'out_of_stock', 'discontinued').optional()
  })


  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const productsValidation = {
  createNew
}
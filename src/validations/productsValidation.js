import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    categoryId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    name: Joi.string().required().messages({
      'any.required': '"product_name" is required.'
    }),
    price: Joi.number().min(0).required().messages({
      'number.min': '"price" must be greater than or equal to 0.',
      'any.required': '"price" is required.'
    }),
    quantity: Joi.number().integer().min(0).optional().messages({
      'number.min': '"quantity" must be greater than or equal to 0.'
    }),
    description: Joi.string().optional().messages({
      'string.base': '"description" must be a string.'
    }),
    imageUrl: Joi.string().optional().messages({
      'string.base': '"imageUrl" must be a string.'
    }),
    status: Joi.string().valid('Còn hàng', 'Hết hàng').default('Còn hàng').messages({
      'any.only': '"status" must be either "Còn hàng" or "Hết hàng".'
    })
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
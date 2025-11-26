import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors.js'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    customersId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    branchesId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

    totalPrice: Joi.number().min(0).required().messages({
      'number.base': '"totalPrice" must be a number.',
      'number.min': '"totalPrice" cannot be negative.',
      'any.required': '"totalPrice" is a required field.'
    }),

    status: Joi.string().valid('Đang chờ', 'Đã xác nhận', 'Đang vận chuyển', 'Đã giao', 'Đã hủy').required().messages({
      'string.base': '"status" must be a string.',
      'string.empty': '"status" cannot be an empty field.',
      'any.only': '"status" must be one of [Đang chờ, Đã xác nhận, Đang vận chuyển, Đã giao, Đã hủy].',
      'any.required': '"status" is a required field.'
    }),

    orderDate: Joi.date().iso().required().messages({
      'date.base': '"orderDate" must be a valid date.',
      'date.iso': '"orderDate" must be in ISO 8601 format (e.g., YYYY-MM-DDTHH:mm:ssZ).',
      'any.required': '"orderDate" is a required field.'
    }),

    deliveryAddress: Joi.string().min(10).max(255).required().messages({
      'string.base': '"deliveryAddress" must be a string.',
      'string.empty': '"deliveryAddress" cannot be an empty field.',
      'string.min': '"deliveryAddress" should have a minimum length of {#limit} characters.',
      'any.required': '"deliveryAddress" is a required field.'
    }),

    note: Joi.string().max(500).allow('').optional().messages({
      'string.base': '"note" must be a string.',
      'string.max': '"note" should have a maximum length of {#limit} characters.'
    })
  })


  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const ordersValidation = {
  createNew
}
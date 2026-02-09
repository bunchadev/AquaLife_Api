import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required().messages({
      'any.required': '"userId" là bắt buộc.'
    }),
    address: Joi.string().min(10).max(200).required().messages({
      'string.base': '"address" phải là chuỗi.',
      'string.min': '"address" tối thiểu {#limit} ký tự.',
      'string.max': '"address" tối đa {#limit} ký tự.',
      'any.required': '"address" là bắt buộc.'
    }),
    totalPrice: Joi.number().min(0).required().messages({
      'number.base': '"totalPrice" phải là số.',
      'number.min': '"totalPrice" phải lớn hơn hoặc bằng {#limit}.',
      'any.required': '"totalPrice" là bắt buộc.'
    }),
    status: Joi.string().valid('Đang đợi', 'Đã xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy', 'pending').default('Đang đợi').optional().messages({
      'string.base': '"status" phải là chuỗi.',
      'any.only': '"status" phải là một trong các giá trị: Đang đợi, Đã xác nhận, Đang giao, Đã giao, Đã hủy.'
    }),
    note: Joi.string().max(500).optional().messages({
      'string.base': '"note" phải là chuỗi.',
      'string.max': '"note" tối đa {#limit} ký tự.'
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

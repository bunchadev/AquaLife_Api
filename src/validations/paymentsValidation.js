import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    orderId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required().messages({
      'any.required': '"orderId" là bắt buộc.'
    }),
    method: Joi.string().valid('cod').optional().messages({
      'string.base': '"method" phải là chuỗi.',
      'any.only': '"method" phải là một trong các giá trị: cod.'
    }),
    status: Joi.string().valid('Đang đợi', 'Đã thanh toán', 'Thất bại').optional().messages({
      'string.base': '"status" phải là chuỗi.',
      'any.only': '"status" phải là một trong các giá trị: Đang đợi, Đã thanh toán, Thất bại.'
    }),
    paidAt: Joi.date().optional().messages({
      'date.base': '"paidAt" phải là định dạng ngày tháng hợp lệ.'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const paymentsValidation = {
  createNew
}

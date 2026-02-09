import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validatiors'

const correctCodition = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  productId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Đánh giá phải là số',
    'number.min': 'Đánh giá tối thiểu là 1',
    'number.max': 'Đánh giá tối đa là 5',
    'any.required': 'Đánh giá là bắt buộc'
  }),
  comment: Joi.string().allow('').max(500).messages({
    'string.base': 'Bình luận phải là chuỗi.',
    'string.max': 'Bình luận tối đa 500 ký tự.'
  })
})

const createNew = async (req, res, next) => {
  try {
    await correctCodition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const reviewsValidation = {
  createNew
}

import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const userSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': '"name" phải là chuỗi.',
    'string.empty': '"name" không được để trống.',
    'string.min': '"name" tối thiểu {#limit} ký tự.',
    'string.max': '"name" tối đa {#limit} ký tự.',
    'any.required': '"name" là bắt buộc.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': '"email" không hợp lệ.',
    'any.required': '"email" là bắt buộc.'
  }),
  password: Joi.string().min(10).max(128).required().messages({
    'string.min': '"password" tối thiểu {#limit} ký tự.',
    'any.required': '"password" là bắt buộc.'
  }),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
    'string.pattern.base': '"phone" phải từ 10-15 số.',
    'any.required': '"phone" là bắt buộc.'
  }),
  address: Joi.string().min(10).max(200).required().messages({
    'string.min': '"address" tối thiểu {#limit} ký tự.',
    'any.required': '"address" là bắt buộc.'
  }),
  role: Joi.string().valid('customer', 'admin').optional(),
  status: Joi.string().valid('active', 'inactive').optional()
})

const createNew = async (req, res, next) => {
  try {
    await userSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const updateById = async (req, res, next) => {
  const updateSchema = userSchema.fork(['password'], (schema) => schema.optional())
  try {
    await updateSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const login = async (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
  try {
    await loginSchema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const userValidation = {
  createNew,
  updateById,
  login
}
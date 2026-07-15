import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const OTP_COLLECTION_NAME = 'otps'

const OTP_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  createdAt: Joi.date().default(() => new Date()),
  // TTL index sẽ tự động xoá document sau 5 phút (tùy cấu hình DB, hoặc tự check ở logic)
  expiresAt: Joi.date().required()
})

const createNew = async (data) => {
  const validData = await OTP_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  return await GET_DB().collection(OTP_COLLECTION_NAME).insertOne(validData)
}

const findByEmailAndOtp = async (email, otp) => {
  return await GET_DB().collection(OTP_COLLECTION_NAME).findOne({ email, otp })
}

const deleteByEmail = async (email) => {
  return await GET_DB().collection(OTP_COLLECTION_NAME).deleteMany({ email })
}

export const otpModel = {
  OTP_COLLECTION_NAME,
  createNew,
  findByEmailAndOtp,
  deleteByEmail
}

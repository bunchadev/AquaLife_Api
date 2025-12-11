import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'

const PROMOS_COLLECTION_NAME = 'promos'
const PROMOS_COLLECTION_SCHEMA = Joi.object({
  code: Joi.string().trim().uppercase().required(),
  type: Joi.string().valid('percent', 'amount').required(),
  value: Joi.number().required(),
  desc: Joi.string().allow('').optional(),
  active: Joi.boolean().default(true),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  minOrder: Joi.number().default(0),
  created_at: Joi.date().timestamp('javascript').default(Date.now),
  updated_at: Joi.date().timestamp('javascript').default(Date.now)
})

const validateBeforeCreate = async (data) => {
  return await PROMOS_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newData = {
      ...validData,
      created_at: Date.now(),
      updated_at: Date.now()
    }
    const result = await GET_DB().collection(PROMOS_COLLECTION_NAME).insertOne(newData)
    return result
  } catch (error) { throw new Error(error) }
}

const getAll = async () => {
  try {
    const items = await GET_DB().collection(PROMOS_COLLECTION_NAME).find({}).toArray()
    return items
  } catch (error) { throw new Error(error) }
}

const validatePromo = async (code, total) => {
  try {
    const promo = await GET_DB().collection(PROMOS_COLLECTION_NAME).findOne({ code: code.toUpperCase(), active: true })
    if (!promo) throw new Error('Mã khuyến mại không tồn tại')
    const now = new Date()
    if (promo.startDate && new Date(promo.startDate) > now) throw new Error('Mã chưa có hiệu lực')
    if (promo.endDate && new Date(promo.endDate) < now) throw new Error('Mã đã hết hạn')
    if (total < promo.minOrder) throw new Error(`Đơn hàng tối thiểu ${promo.minOrder.toLocaleString('vi-VN')}đ`)
    const discount = promo.type === 'percent' ? Math.floor(total * promo.value / 100) : promo.value
    return { ...promo, discount }
  } catch (error) { throw new Error(error.message) }
}

export const promosModel = {
  createNew,
  getAll,
  validatePromo
}

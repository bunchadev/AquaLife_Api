import { promosModel } from '~/models/promosModel'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newPromo = {
      ...reqBody
    }
    const createPromo = await promosModel.createNew(newPromo)
    return createPromo
  } catch (error) { throw error }
}

const getAll = async () => {
  return await promosModel.getAll()
}

const validatePromo = async (code, total) => {
  return await promosModel.validatePromo(code, total)
}

export const promosService = {
  createNew,
  getAll,
  validatePromo
}

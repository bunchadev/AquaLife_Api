import { headquaterModel } from '~/models/headquaterModel'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newHeadquater = {
      ...reqBody
    }

    const createHeadquater = await headquaterModel.createNew(newHeadquater)
    return createHeadquater
  } catch (error) { throw error }
}

const getInfo = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const info = await headquaterModel.getInfo()
    return info
  } catch (error) { throw error }
}

export const headquaterService = {
  createNew
  , getInfo
}
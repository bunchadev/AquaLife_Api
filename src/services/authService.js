import { usersService } from '~/services/usersService.js'

const login = async (email, password) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await usersService.login({ email, password })
    return {
      message: 'Login successful',
      token: result.token,
      user: result.customer
    }
  } catch (error) { throw error }
}

const register = async (userPayload) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const createUser = await usersService.createNew(userPayload)
    return {
      message: userPayload.role === 'admin' ? 'Admin account created' : 'Customer account created',
      data: createUser
    }
  } catch (error) { throw error }
}

export const authService = {
  login,
  register
}

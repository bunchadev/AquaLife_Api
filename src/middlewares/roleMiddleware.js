import ApiError from '../errors/ApiError.js'
import { userService } from '../services/userService.js'
import { StatusCodes } from 'http-status-codes'

export const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id
      const user = await userService.findById(userId)

      if (!user) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not found'))
      }
      if (user.role !== requiredRole) {
        return next(new ApiError(StatusCodes.FORBIDDEN, 'Access denied'))
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
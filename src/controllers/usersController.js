import { StatusCodes } from 'http-status-codes'
import { usersService } from '~/services/usersService'

const createNew = async (req, res, next) => {
  try {
    const user = await usersService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(user)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const result = await usersService.login(req.body)
    
    // Set HTTP-Only Cookie for Refresh Token
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.BUILD_MODE === 'production', // true trên production (HTTPS), false ở local (HTTP)
      sameSite: 'lax', // Bảo vệ khỏi CSRF cơ bản
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 ngày
    })

    // Xoá refreshToken khỏi kết quả trả về, để JS ở Frontend không đọc được
    delete result.refreshToken

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getAll = async (req, res, next) => {
  try {
    const items = await usersService.getAll()
    res.status(StatusCodes.OK).json(items)
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const id = req.params.id
    const item = await usersService.findById(id)
    if (!item) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })
    res.status(StatusCodes.OK).json(item)
  } catch (error) { next(error) }
}

const updateById = async (req, res, next) => {
  try {
    const id = req.params.id
    const updated = await usersService.updateById(id, req.body)
    res.status(StatusCodes.OK).json(updated)
  } catch (error) { next(error) }
}

const deleteById = async (req, res, next) => {
  try {
    const id = req.params.id
    await usersService.deleteById(id)
    res.status(StatusCodes.NO_CONTENT).end()
  } catch (error) { next(error) }
}

const refreshToken = async (req, res, next) => {
  try {
    // Đọc refreshToken từ Cookie thay vì từ req.body
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing refresh token in cookies' })
    }
    const result = await usersService.refreshToken(refreshToken)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const logout = async (req, res, next) => {
  try {
    // Lấy user id từ token đã được authMiddleware parse
    const userId = req.user.id
    const result = await usersService.logout(userId)
    
    // Xóa cookie refresh_token
    res.clearCookie('refresh_token')

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const usersController = {
  createNew,
  login,
  getAll,
  getById,
  updateById,
  deleteById,
  refreshToken,
  logout
}
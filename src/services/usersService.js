import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { usersModel } from '~/models/usersModel.js'

const buildPublicUser = (userDoc) => {
  if (!userDoc) return null
  const rest = { ...userDoc }
  delete rest.password
  return rest
}

const createNew = async (reqBody) => {
  const existing = await usersModel.findByEmail(reqBody.email)
  if (existing) throw new ApiError(StatusCodes.CONFLICT, 'Email đã được đăng ký')

  const hashedPassword = await bcrypt.hash(reqBody.password, 10)
  const newUser = {
    name: reqBody.name,
    email: reqBody.email,
    phone: reqBody.phone,
    address: reqBody.address,
    password: hashedPassword,
    role: reqBody.role || 'customer',
    status: reqBody.status || 'active'
  }

  const result = await usersModel.createNew(newUser)
  const created = await usersModel.findById(result.insertedId)
  return buildPublicUser(created)
}

const getAll = async () => {
  const items = await usersModel.getAll()
  return items.map(buildPublicUser)
}

const findById = async (id) => buildPublicUser(await usersModel.findById(id))

const updateById = async (id, data) => {
  const updatePayload = { ...data }
  if (data.password) {
    updatePayload.password = await bcrypt.hash(data.password, 10)
  }
  await usersModel.updateById(id, updatePayload)
  return buildPublicUser(await usersModel.findById(id))
}

const deleteById = async (id) => usersModel.deleteById(id)

const login = async ({ email, password }) => {
  const user = await usersModel.findByEmail(email)
  if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Sai email hoặc mật khẩu')

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Sai email hoặc mật khẩu')

  const payload = { id: user._id, email: user.email, role: user.role, name: user.name }
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1d' })
  return { token, customer: buildPublicUser(user) }
}

export const usersService = {
  createNew,
  getAll,
  findById,
  updateById,
  deleteById,
  login
}
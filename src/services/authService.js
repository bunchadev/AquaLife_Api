import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authModel } from '~/models/authModel'
import { customersModel } from '~/models/customersModel'
import { env } from '~/config/environment'
import { employeesService } from '~/services/employeesService.js'
import { customersService } from '~/services/customersService.js'

const login = async (email, password) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const employees = await authModel.findByEmail(email)
    if (employees) {
      const isMatch = await bcrypt.compare(password, employees.password)
      if (!isMatch) throw new Error('Incorrect password')

      const token = jwt.sign(
        { id: employees._id, role: employees.role, email: employees.email },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN || '7d' }
      )

      return {
        message: 'Login successful',
        token,
        employee: {
          id: employees._id,
          name: employees.name,
          email: employees.email,
          role: employees.role
        }
      }
    }
    // If no employee found, try customers collection
    const customer = await customersModel.findByEmail(email)
    if (customer) {
      const isMatchCust = await bcrypt.compare(password, customer.password)
      if (!isMatchCust) throw new Error('Incorrect password')

      const tokenCust = jwt.sign(
        { id: customer._id, role: 'customer', email: customer.email },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN || '7d' }
      )

      return {
        message: 'Login successful',
        token: tokenCust,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          role: 'customer',
          image: customer.image || ''
        }
      }
    }
  } catch (error) { throw error }
}

const register = async (userPayload) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (userPayload.role) {
      const createEmployees = await employeesService.createNew(userPayload)
      return { message: 'Employee account created', data: createEmployees }
    }

    const createCustomer = await customersService.createNew(userPayload)
    return { message: 'Customer account created', data: createCustomer }
  } catch (error) { throw error }
}

export const authService = {
  login,
  register
}

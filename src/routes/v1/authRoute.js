import express from 'express'
import { usersController } from '~/controllers/usersController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.post('/register', userValidation.createNew, usersController.createNew)
Router.post('/login', userValidation.login, usersController.login)
Router.post('/refresh-token', usersController.refreshToken)

// Import authMiddleware để lấy req.user cho route logout
import { authMiddleware } from '~/middlewares/authMiddleware'
Router.delete('/logout', authMiddleware, usersController.logout)

export const authRouter = Router

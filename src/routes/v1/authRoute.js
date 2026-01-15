import express from 'express'
import { usersController } from '~/controllers/usersController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.post('/register', userValidation.createNew, usersController.createNew)
Router.post('/login', userValidation.login, usersController.login)

export const authRouter = Router

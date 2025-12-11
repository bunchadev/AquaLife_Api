import express from 'express'
import { promosController } from '~/controllers/promosController.js'

const Router = express.Router()

Router.route('/')
  .post(promosController.createNew)
  .get(promosController.getAll)

Router.post('/validate', promosController.validatePromo)

export const promosRouter = Router
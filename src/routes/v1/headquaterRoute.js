import express from 'express'
import { headquaterController } from '~/controllers/headquaterController.js'
import { headquaterValidation } from '~/validations/headquaterValidation.js'

const Router = express.Router()

Router.route('/')
  .get(headquaterController.getInfo)
  .post(headquaterValidation.createNew, headquaterController.createNew)

export const headquaterRouter = Router
/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from './config/cors'

const START_SERVER = () => {
  const app = express()

  // Cấu hình middleware cơ bản
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    const server = app.listen(process.env.PORT, () => {
      console.log(`Production Hello ${env.AUTHOR}, Back-end server is running successfully at Port ${process.env.PORT}`)
    })
    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${process.env.PORT} is already in use. Please free the port or set PORT to a different value.`)
        process.exit(1)
      }
      console.error('Server error', err)
      process.exit(1)
    })
  } else {
    const server = app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      console.log(`Local Dev Hello ${env.AUTHOR}, Back-end server is running successfully at Host ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`)
    })
    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Local Dev port ${env.LOCAL_DEV_APP_PORT} is already in use. Please free the port or change LOCAL_DEV_APP_PORT in your environment.`)
        process.exit(1)
      }
      console.error('Server error', err)
      process.exit(1)
    })
  }

  // Đảm bảo đóng kết nối DB khi thoát ứng dụng
  exitHook(() => {
    console.log('disconnecting')
    CLOSE_DB()
    console.log('disconnected')

  })
}

(async () => {
  try {
    console.log('Connecting to MongoDB Cloud Atlas!')
    await CONNECT_DB()
    console.log('Connected to MongoDB Cloud Atlas!')

    START_SERVER()
  } catch (error) {
    console.log(error)
    process.exit(0)
  }
})()


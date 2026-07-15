import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT,
  LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST,

  BUILD_MODE: process.env.BUILD_MODE,

  AUTHOR: process.env.AUTHOR,

  JWT_KEY: process.env.JWT_KEY,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD
}

import dotenv from 'dotenv'
dotenv.config()

export const expressConfig = {
  port: Number(process.env.PORT) || 3020,
}

export const appConfig = {
  expressConfig,
}

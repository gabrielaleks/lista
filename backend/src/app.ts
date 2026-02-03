import express, { Request, Response, Express } from 'express'
import { createRouter as createListRouter } from './web/list/routes'
import { corsMiddleware } from './middlewares/cors.middleware'
import { notFoundMiddleware } from './middlewares/notfound.middleware'
import { getLogger } from './utils/logger'
import { DatabaseConnection } from './utils/DatabaseConnection'
import { errorMiddleware } from './middlewares/error.middleware'

export function createServer({ dbConnection }: { dbConnection: DatabaseConnection }): Express {
  const app = express()

  app.use(corsMiddleware())
  app.use(express.json())

  app.use((req: Request, _res: Response, next) => {
    getLogger().info('Incoming request', {
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    })
    next()
  })

  app.use(
    '/api',
    createListRouter(dbConnection)
  )

  app.use(notFoundMiddleware)
  app.use(errorMiddleware)

  return app
}
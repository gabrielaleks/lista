import cors from 'cors'

export const corsMiddleware = () => {
  const frontendHost = process.env.LOCAL_FRONTEND_HOST
  const frontendPort = process.env.LOCAL_FRONTEND_PORT

  if (!frontendHost || !frontendPort) {
    throw new Error('Frontend host/port not defined in environment variables')
  }

  return cors({
    origin: `http://${frontendHost}:${frontendPort}`,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
}

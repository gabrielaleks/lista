import cors from 'cors'

const frontendHost = process.env.LOCAL_FRONTEND_HOST || 'localhost'
const frontendPort = process.env.LOCAL_FRONTEND_PORT || '5173'

export const corsMiddleware = cors({
  origin: `http://${frontendHost}:${frontendPort}`,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
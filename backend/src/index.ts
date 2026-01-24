import dotenv from 'dotenv'
if (process.env.DEPLOYMENT_ENVIRONMENT?.toLowerCase() === 'test') {
  dotenv.config({ path: '.env.test' })
} else {
  dotenv.config({ path: '.env' })
}

import { createServer } from './app'
import { initializePostgresDb } from './utils/DatabaseConnection'

const dbConnection = initializePostgresDb()
const app = createServer({ dbConnection })
const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})

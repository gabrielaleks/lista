import { Pool, QueryResult, QueryResultRow } from "pg"
import { getLogger } from "./logger"

let dbConnection: PostgresDatabaseConnection | null = null

export interface TransactionContext {
  query<T extends QueryResultRow = any>(sql: string, params?: any[]): Promise<QueryResult<T>>
}

export function initializePostgresDb(): PostgresDatabaseConnection {
  if (dbConnection) return dbConnection

  const pool = new Pool({
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
    host: process.env.DB_HOST || 'localhost',
    max: 20,
    idleTimeoutMillis: 10000,
    statement_timeout: 30000,
  })

  dbConnection = new PostgresDatabaseConnection(pool)

  if (process.env.ENABLE_SQL_LOGGING?.toLowerCase() === 'true') {
    enableSqlLogging(pool)
  }

  return dbConnection
}

function enableSqlLogging(pool: Pool) {
  const logger = getLogger()

  const originalQuery = pool.query.bind(pool)
  pool.query = async (...args: any[]) => {
    const start = Date.now()
    try {
      // @ts-expect-error: Spread arguments are safe here
      const result = await originalQuery(...args)
      const duration = Date.now() - start

      logger.info('Database query completed', {
        query: args[0],
        parameters: args[1] || [],
        duration: `${duration}ms`,
        rowCount: result.rowCount
      })

      return result
    } catch (error) {
      logger.error('Database query error', {
        query: args[0],
        parameters: args[1] || [],
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    }
  }

  // Add error logging for pool events
  pool.on('error', (err: any) => {
    logger.error('Unexpected database error', {
      error: err.message,
      stack: err.stack
    })
  })
}

export interface DatabaseConnection {
  query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>>
  transaction<T>(callback: (transactionContext: TransactionContext) => Promise<T>): Promise<T>
}

export class PostgresDatabaseConnection implements DatabaseConnection {
  constructor(private pool: Pool) { }

  async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    return this.pool.query(text, params)
  }

  async transaction<T>(callback: (transactionContext: TransactionContext) => Promise<T>): Promise<T> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')

      const transactionContext: TransactionContext = {
        query: (sql, params) => client.query(sql, params),
      }

      const result = await callback(transactionContext)

      await client.query('COMMIT')
      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release(true)
    }
  }
}
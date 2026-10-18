import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@shared/env.ts'
import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { PrismaClient } from './generated/prisma/client.ts'

const databaseURL = new URL(env.DATABASE_URL)

if (env.NODE_ENV === 'test') {
  databaseURL.searchParams.set('schema', `test-${randomUUID()}`)
}

const adapter = new PrismaPg({ connectionString: databaseURL.toString() })
const prisma = new PrismaClient({
  adapter,
  // log: ['query', 'error'],
})

export { prisma }

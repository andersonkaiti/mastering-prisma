import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
})

export const env = envSchema.parse(process.env)

import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { batchCreateUsersRoute } from './routes/batch-create-users.route.ts'
import { createUserRoute } from './routes/create-user.route.ts'
import { getStats } from './routes/get-stats.ts'
import { getUserRoute } from './routes/get-user.route.ts'
import { getUsersRoute } from './routes/get-users.route.ts'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.get('/health', () => ({ status: 'ok' }))

app.register(createUserRoute)
app.register(batchCreateUsersRoute)
app.register(getUsersRoute)
app.register(getUserRoute)
app.register(getStats)

import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { batchCreateUsersRoute } from './routes/batch-create-users.route.ts'
import { createUserRoute } from './routes/create-user.route.ts'
import { deleteUserRoute } from './routes/delete-user.route.ts'
import { getStatsRoute } from './routes/get-stats.route.ts'
import { getUserRoute } from './routes/get-user.route.ts'
import { getUsersRoute } from './routes/get-users.route.ts'
import { updateUserRoute } from './routes/update-user.route.ts'
import { upsertUserRoute } from './routes/upsert-user.route.ts'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.get('/health', () => ({ status: 'ok' }))

app.register(createUserRoute)
app.register(batchCreateUsersRoute)
app.register(getUsersRoute)
app.register(getUserRoute)
app.register(getStatsRoute)
app.register(updateUserRoute)
app.register(upsertUserRoute)
app.register(deleteUserRoute)

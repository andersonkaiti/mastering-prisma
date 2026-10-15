import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeUpsertUserUseCase } from '../factories/upsert-user-use-case.factory.ts'

export async function upsertUserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    url: '/users',
    method: 'PUT',
    schema: {
      body: z.object({
        name: z.string(),
        email: z.string(),
        birthdate: z.coerce.date().optional(),
        isActive: z.boolean().optional(),
      }),
      response: {
        200: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string().nullable(),
          birthdate: z.date().nullable(),
          isActive: z.boolean(),
        }),
      },
    },
    handler: async (request, reply) => {
      const getUpsertUserUseCase = makeUpsertUserUseCase()

      const user = await getUpsertUserUseCase.execute(request.body)

      reply.status(200).send(user)
    },
  })
}

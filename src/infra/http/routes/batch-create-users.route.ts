import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeBatchCreateUsersUseCase } from '../factories/batch-create-users-use-case.factory.ts'

export async function batchCreateUsersRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    url: '/users/batch',
    method: 'POST',
    schema: {
      body: z.object({
        users: z.array(
          z.object({
            name: z.string(),
            email: z.email(),
          }),
        ),
      }),
      responses: {
        201: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          birthdate: z.date().nullable(),
          isActive: z.boolean().nullable(),
        }),
      },
    },
    handler: async (request, reply) => {
      const batchCreateUsersUseCase = makeBatchCreateUsersUseCase()

      const users = await batchCreateUsersUseCase.execute(request.body)

      reply.status(201).send(users)
    },
  })
}

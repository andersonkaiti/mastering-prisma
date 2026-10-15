import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeDeleteUserUseCase } from '../factories/delete-user-use-case.factory.ts'

export async function deleteUserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    url: '/users/:id',
    method: 'DELETE',
    schema: {
      params: z.object({
        id: z.uuid(),
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
      const getDeleteUserUseCase = makeDeleteUserUseCase()

      const user = await getDeleteUserUseCase.execute(request.params)

      reply.status(200).send(user)
    },
  })
}

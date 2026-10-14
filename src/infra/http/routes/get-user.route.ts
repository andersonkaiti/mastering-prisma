import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeGetUserUseCase } from '../factories/get-user-use-case.factory.ts'

export async function getUserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    url: '/users/:id',
    method: 'GET',
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z
          .object({
            id: z.string(),
            name: z.string(),
            email: z.string().nullable(),
            birthdate: z.date().nullable(),
            isActive: z.boolean(),
          })
          .nullable(),
      },
    },
    handler: async (request, reply) => {
      const getUserUseCase = makeGetUserUseCase()

      const user = await getUserUseCase.execute(request.params)

      reply.status(200).send(user)
    },
  })
}

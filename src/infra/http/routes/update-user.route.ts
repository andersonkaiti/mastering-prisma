import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeUpdateUserUseCase } from '../factories/update-user-use-case.factory.ts'

export async function updateUserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    url: '/users/:id',
    method: 'PUT',
    schema: {
      params: z.object({
        id: z.uuid(),
      }),
      body: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        birthdate: z.date().optional(),
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
      const getUpdateUserUseCase = makeUpdateUserUseCase()

      const user = await getUpdateUserUseCase.execute({
        id: request.params.id,
        user: request.body,
      })

      reply.status(200).send(user)
    },
  })
}

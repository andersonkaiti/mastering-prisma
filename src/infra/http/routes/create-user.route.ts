import { makeCreateUserUseCase } from '@infra/http/factories/create-user-use-case.factory.ts'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function createUserRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    url: '/users',
    method: 'POST',
    schema: {
      body: z.object({
        name: z.string(),
        email: z.email(),
      }),
      responses: {
        201: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          birthdate: z.date().nullable(),
          isActive: z.boolean(),
        }),
      },
    },
    handler: async (request, reply) => {
      const createUserUseCase = makeCreateUserUseCase()

      const user = await createUserUseCase.execute(request.body)

      reply.status(201).send(user)
    },
  })
}

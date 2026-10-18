import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeGetUsersUseCase } from '../factories/get-users-use-case.factory.ts'

export async function getUsersRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    url: '/users',
    method: 'GET',
    schema: {
      response: {
        200: z.array(
          z.object({
            id: z.uuid(),
            name: z.string(),
            email: z.string().nullable(),
            birthdate: z.date().nullable(),
            isActive: z.boolean(),
            affiliationId: z.uuid().nullable(),
            profile: z
              .object({
                id: z.uuid().nullable(),
                userId: z.uuid().nullable(),
                instagram: z.string().nullable(),
                github: z.string().nullable(),
                bio: z.string().nullable(),
              })
              .nullable(),
            orders: z.array(
              z.object({
                id: z.uuid(),
                userId: z.uuid(),
                value: z.number(),
                products: z.array(
                  z.object({
                    orderId: z.uuid(),
                    productId: z.uuid(),
                    quantity: z.number(),
                    product: z.object({
                      id: z.uuid(),
                      name: z.string(),
                    }),
                  }),
                ),
              }),
            ),
            affiliated: z
              .object({
                id: z.uuid(),
                name: z.string(),
                email: z.string().nullable(),
                birthdate: z.date().nullable(),
                isActive: z.boolean(),
              })
              .nullable(),
            affiliations: z.array(
              z.object({
                id: z.uuid(),
                name: z.string(),
                email: z.string().nullable(),
                birthdate: z.date().nullable(),
                isActive: z.boolean(),
                affiliationId: z.uuid().nullable(),
              }),
            ),
          }),
        ),
      },
    },
    handler: async (_request, reply) => {
      const getUsersUseCase = makeGetUsersUseCase()

      const users = await getUsersUseCase.execute()

      reply.status(200).send(users)
    },
  })
}

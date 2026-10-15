import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeTransactionUseCase } from '../factories/transaction-use-case.factory.ts'

export async function transactionsRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    url: '/users/tx',
    method: 'POST',
    schema: {
      response: {
        200: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().nullable(),
            birthdate: z.date().nullable(),
            isActive: z.boolean(),
          }),
        ),
      },
    },
    handler: async (_request, reply) => {
      const transactionUseCase = makeTransactionUseCase()

      const users = await transactionUseCase.execute()

      reply.status(200).send(users)
    },
  })
}

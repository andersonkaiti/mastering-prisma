import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { makeGetStatsUseCase } from '../factories/get-stats-use-case.factory.ts'

export async function getStatsRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    url: '/stats',
    method: 'GET',
    schema: {
      response: {
        200: z.object({
          totalUsers: z.number(),
          totalEmails: z.number(),
          oldestBirthdate: z.date().nullable(),
          youngerBirthdate: z.date().nullable(),
        }),
      },
    },
    handler: async (_request, reply) => {
      const getStatsUseCase = makeGetStatsUseCase()

      const stats = await getStatsUseCase.execute()

      reply.status(200).send(stats)
    },
  })
}

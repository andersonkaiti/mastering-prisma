import { faker } from '@faker-js/faker'
import type { Prisma } from '@infra/database/prisma/generated/prisma/client.ts'
import { prisma } from '@infra/database/prisma/index.ts'
import { app } from '@infra/http/app.ts'
import { afterAll, beforeAll, beforeEach } from 'vitest'

export { app }

export function makeUserInput(overrides: Partial<Prisma.UserCreateInput> = {}) {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    ...overrides,
  }
}

export async function createUser(
  overrides: Partial<Prisma.UserCreateInput> = {},
) {
  return prisma.user.create({
    data: makeUserInput(overrides),
  })
}

export async function cleanDatabase() {
  // Delete in FK-safe order so cascades never hit a restricted relation.
  await prisma.orderProduct.deleteMany()
  await prisma.order.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
}

/**
 * Wires the shared lifecycle for an HTTP e2e test file: boots the Fastify
 * instance once, tears it down at the end and resets the database between tests.
 */
export function setupHttpTest() {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    await cleanDatabase()
  })
}

import { faker } from '@faker-js/faker'
import { prisma } from './index.ts'

const USERS_COUNT = 20

function makeUser(index: number) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    name: `${firstName} ${lastName}`,
    email: faker.helpers.maybe(
      // Suffix with the index to guarantee the @unique constraint.
      () =>
        faker.internet.email({ firstName, lastName }).replace('@', `${index}@`),
      { probability: 0.8 },
    ),
    birthdate: faker.helpers.maybe(
      () => faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
      { probability: 0.8 },
    ),
    isActive: faker.datatype.boolean({ probability: 0.7 }),
  }
}

try {
  console.log('🌱 Seeding database...')

  await prisma.user.deleteMany()

  await prisma.user.createMany({
    data: Array.from({ length: USERS_COUNT }, (_, index) => makeUser(index)),
  })

  const count = await prisma.user.count()

  console.log(`✅ Seed completed: ${count} users created.`)
} catch (error) {
  console.error('❌ Seed failed:', error)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}

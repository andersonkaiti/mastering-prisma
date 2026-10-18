import { faker } from '@faker-js/faker'
import { makeOrder } from '@shared/utils/make-order.ts'
import { makeProduct } from '@shared/utils/make-product.ts'
import { makeProfile } from '@shared/utils/make-profile.ts'
import { makeUser } from '@shared/utils/make-user.ts'
import { prisma } from './index.ts'

const USERS_COUNT = 20
const PRODUCTS_COUNT = 30

try {
  console.log('🌱 Seeding database...')

  await prisma.user.deleteMany()
  await prisma.product.deleteMany()

  const products = await Promise.all(
    Array.from({ length: PRODUCTS_COUNT }, () =>
      prisma.product.create({
        data: makeProduct(),
      }),
    ),
  )

  const users = await Promise.all(
    Array.from({ length: USERS_COUNT }, () =>
      prisma.user.create({
        data: {
          ...makeUser(),
          profile: {
            create: makeProfile(),
          },
          orders: {
            create: {
              ...makeOrder(),
              products: {
                create: faker.helpers
                  .arrayElements(products, { min: 1, max: 5 })
                  .map((product) => ({
                    quantity: faker.number.int({ min: 1, max: 10 }),
                    product: {
                      connect: { id: product.id },
                    },
                  })),
              },
            },
          },
        },
      }),
    ),
  )

  const affiliations = users.flatMap((user, index) => {
    const possibleAffiliates = users.slice(0, index)

    if (possibleAffiliates.length === 0) {
      return []
    }

    const affiliated = faker.helpers.maybe(
      () => faker.helpers.arrayElement(possibleAffiliates),
      { probability: 0.6 },
    )

    if (!affiliated) {
      return []
    }

    return prisma.user.update({
      where: { id: user.id },
      data: {
        affiliated: {
          connect: { id: affiliated.id },
        },
      },
    })
  })

  await Promise.all(affiliations)

  const [usersCount, productsCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
  ])

  console.log(
    `✅ Seed completed: ${usersCount} users and ${productsCount} products created.`,
  )
} catch (error) {
  console.error('❌ Seed failed:', error)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}

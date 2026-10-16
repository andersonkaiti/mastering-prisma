import { makeOrder } from '@shared/utils/make-order.ts'
import { makeProfile } from '@shared/utils/make-profile.ts'
import { makeUser } from '@shared/utils/make-user.ts'
import { prisma } from './index.ts'

const USERS_COUNT = 20

try {
  console.log('🌱 Seeding database...')

  await prisma.user.deleteMany()

  await Promise.all(
    Array.from({ length: USERS_COUNT }, () =>
      prisma.user.create({
        data: {
          ...makeUser(),
          profile: {
            create: makeProfile(),
          },
          orders: {
            create: makeOrder(),
          },
        },
      }),
    ),
  )

  const count = await prisma.user.count()

  console.log(`✅ Seed completed: ${count} users created.`)
} catch (error) {
  console.error('❌ Seed failed:', error)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}

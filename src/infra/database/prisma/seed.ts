import { makeUser } from '@shared/utils/make-user.ts'
import { prisma } from './index.ts'

const USERS_COUNT = 20

try {
  console.log('🌱 Seeding database...')

  await prisma.user.deleteMany()

  await prisma.user.createMany({
    data: Array.from({ length: USERS_COUNT }, (_) => makeUser()),
  })

  const count = await prisma.user.count()

  console.log(`✅ Seed completed: ${count} users created.`)
} catch (error) {
  console.error('❌ Seed failed:', error)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}

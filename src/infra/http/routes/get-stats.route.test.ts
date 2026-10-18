import { faker } from '@faker-js/faker'
import { prisma } from '@infra/database/prisma/index.ts'
import { app, createUser, setupHttpTest } from '@shared/test/http.ts'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

setupHttpTest()

describe('GET /stats', () => {
  it('returns zeroed stats when there are no users', async () => {
    const response = await request(app.server).get('/stats')

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      totalUsers: 0,
      totalEmails: 0,
      oldestBirthdate: null,
      youngerBirthdate: null,
    })
  })

  it('counts the total number of users', async () => {
    await createUser()
    await createUser()

    const response = await request(app.server).get('/stats')

    expect(response.body.totalUsers).toBe(2)
  })

  it('counts only users that have an email', async () => {
    await createUser()
    await prisma.user.create({ data: { name: faker.person.fullName() } })

    const response = await request(app.server).get('/stats')

    expect(response.body.totalUsers).toBe(2)
    expect(response.body.totalEmails).toBe(1)
  })

  it('returns the oldest and youngest birthdates', async () => {
    const oldest = new Date('1950-01-01T00:00:00.000Z')
    const youngest = new Date('2000-01-01T00:00:00.000Z')

    await createUser({ birthdate: oldest })
    await createUser({ birthdate: new Date('1980-01-01T00:00:00.000Z') })
    await createUser({ birthdate: youngest })

    const response = await request(app.server).get('/stats')

    expect(new Date(response.body.oldestBirthdate).toISOString()).toBe(
      oldest.toISOString(),
    )
    expect(new Date(response.body.youngerBirthdate).toISOString()).toBe(
      youngest.toISOString(),
    )
  })
})

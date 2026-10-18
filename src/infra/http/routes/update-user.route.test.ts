import { faker } from '@faker-js/faker'
import { prisma } from '@infra/database/prisma/index.ts'
import { app, createUser, setupHttpTest } from '@shared/test/http.ts'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

setupHttpTest()

describe('PUT /users/:id', () => {
  it('updates the user name and returns it', async () => {
    const user = await createUser()
    const newName = faker.person.fullName()

    const response = await request(app.server)
      .put(`/users/${user.id}`)
      .send({ name: newName, isActive: false })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: user.id,
      name: newName,
      isActive: false,
    })
  })

  it('updates the birthdate from an ISO string', async () => {
    const user = await createUser()
    const birthdate = new Date('1990-05-20T00:00:00.000Z')

    const response = await request(app.server)
      .put(`/users/${user.id}`)
      .send({ birthdate: birthdate.toISOString() })

    expect(response.status).toBe(200)
    expect(new Date(response.body.birthdate).toISOString()).toBe(
      birthdate.toISOString(),
    )
  })

  it('persists the update in the database', async () => {
    const user = await createUser()
    const newEmail = faker.internet.email()

    await request(app.server).put(`/users/${user.id}`).send({ email: newEmail })

    const stored = await prisma.user.findUnique({ where: { id: user.id } })
    expect(stored?.email).toBe(newEmail)
  })

  it('keeps the other fields when only one is sent', async () => {
    const user = await createUser()
    const newName = faker.person.fullName()

    const response = await request(app.server)
      .put(`/users/${user.id}`)
      .send({ name: newName })

    expect(response.body.email).toBe(user.email)
    expect(response.body.isActive).toBe(user.isActive)
  })

  it('returns 400 when the id is not a valid uuid', async () => {
    const response = await request(app.server)
      .put('/users/invalid-id')
      .send({ name: faker.person.fullName() })

    expect(response.status).toBe(400)
  })

  it('returns 500 when updating a non-existent user', async () => {
    const response = await request(app.server)
      .put(`/users/${faker.string.uuid()}`)
      .send({ name: faker.person.fullName() })

    expect(response.status).toBe(500)
  })
})

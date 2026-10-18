import { faker } from '@faker-js/faker'
import { prisma } from '@infra/database/prisma/index.ts'
import {
  app,
  createUser,
  makeUserInput,
  setupHttpTest,
} from '@shared/test/http.ts'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

setupHttpTest()

describe('PUT /users', () => {
  it('creates the user when the email does not exist yet', async () => {
    const input = makeUserInput()

    const response = await request(app.server).put('/users').send(input)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: input.name,
      email: input.email,
    })
  })

  it('does not duplicate the user when upserting a new email', async () => {
    await request(app.server).put('/users').send(makeUserInput())

    const count = await prisma.user.count()
    expect(count).toBe(1)
  })

  it('updates the existing user with the same email', async () => {
    const user = await createUser()
    const newName = faker.person.fullName()

    const response = await request(app.server)
      .put('/users')
      .send({ name: newName, email: user.email })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: user.id,
      name: newName,
      email: user.email,
    })
  })

  it('does not create a new row when updating by email', async () => {
    const user = await createUser()

    await request(app.server)
      .put('/users')
      .send({ name: faker.person.fullName(), email: user.email })

    const count = await prisma.user.count()
    expect(count).toBe(1)
  })

  it('returns 400 when the email is missing', async () => {
    const response = await request(app.server)
      .put('/users')
      .send({ name: faker.person.fullName() })

    expect(response.status).toBe(400)
  })

  it('returns 400 when the name is missing', async () => {
    const response = await request(app.server)
      .put('/users')
      .send({ email: faker.internet.email() })

    expect(response.status).toBe(400)
  })
})

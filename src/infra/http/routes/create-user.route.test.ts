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

describe('POST /users', () => {
  it('creates a user and returns it with status 201', async () => {
    const input = makeUserInput()

    const response = await request(app.server).post('/users').send(input)

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: input.name,
      email: input.email,
      isActive: true,
    })
  })

  it('creates the user with default values', async () => {
    const response = await request(app.server)
      .post('/users')
      .send(makeUserInput())

    expect(response.status).toBe(201)
    expect(response.body.isActive).toBe(true)
    expect(response.body.birthdate).toBeNull()
    expect(response.body.affiliationId).toBeNull()
  })

  it('persists the created user in the database', async () => {
    const input = makeUserInput()

    const response = await request(app.server).post('/users').send(input)

    const stored = await prisma.user.findUnique({
      where: { id: response.body.id },
    })
    expect(stored).not.toBeNull()
    expect(stored?.email).toBe(input.email)
  })

  it('ignores unknown fields in the body', async () => {
    const input = makeUserInput()

    const response = await request(app.server)
      .post('/users')
      .send({ ...input, role: 'admin', isActive: false })

    expect(response.status).toBe(201)
    expect(response.body).not.toHaveProperty('role')
  })

  it('returns 400 when the email is invalid', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ name: faker.person.fullName(), email: 'not-an-email' })

    expect(response.status).toBe(400)
  })

  it('returns 400 when the name is missing', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ email: faker.internet.email() })

    expect(response.status).toBe(400)
  })

  it('returns 400 when the email is missing', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ name: faker.person.fullName() })

    expect(response.status).toBe(400)
  })

  it('returns 400 when the body is empty', async () => {
    const response = await request(app.server).post('/users').send({})

    expect(response.status).toBe(400)
  })

  it('fails to create a user with a duplicated email', async () => {
    const existing = await createUser()

    const response = await request(app.server)
      .post('/users')
      .send({ name: faker.person.fullName(), email: existing.email })

    expect(response.status).toBe(500)
  })
})

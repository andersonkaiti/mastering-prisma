import { prisma } from '@infra/database/prisma/index.ts'
import { app, makeUserInput, setupHttpTest } from '@shared/test/http.ts'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

setupHttpTest()

describe('POST /users/batch', () => {
  it('creates many users and returns them with status 201', async () => {
    const users = Array.from({ length: 3 }, () => makeUserInput())

    const response = await request(app.server)
      .post('/users/batch')
      .send({ users })

    expect(response.status).toBe(201)
    expect(response.body).toHaveLength(3)
    expect(response.body.map((user: { email: string }) => user.email)).toEqual(
      users.map((user) => user.email),
    )
  })

  it('persists every created user in the database', async () => {
    const users = Array.from({ length: 5 }, () => makeUserInput())

    await request(app.server).post('/users/batch').send({ users })

    const count = await prisma.user.count()
    expect(count).toBe(5)
  })

  it('skips duplicated emails', async () => {
    const input = makeUserInput()

    const response = await request(app.server)
      .post('/users/batch')
      .send({ users: [input, input] })

    expect(response.status).toBe(201)
    expect(response.body).toHaveLength(1)
  })

  it('returns an empty array when no users are sent', async () => {
    const response = await request(app.server)
      .post('/users/batch')
      .send({ users: [] })

    expect(response.status).toBe(201)
    expect(response.body).toEqual([])
  })

  it('returns 400 when a user has an invalid email', async () => {
    const response = await request(app.server)
      .post('/users/batch')
      .send({ users: [{ name: 'John', email: 'invalid' }] })

    expect(response.status).toBe(400)
  })

  it('returns 400 when a user is missing the email', async () => {
    const response = await request(app.server)
      .post('/users/batch')
      .send({ users: [{ name: 'No email' }] })

    expect(response.status).toBe(400)
  })

  it('returns 400 when the users field is missing', async () => {
    const response = await request(app.server).post('/users/batch').send({})

    expect(response.status).toBe(400)
  })

  it('returns 400 when users is not an array', async () => {
    const response = await request(app.server)
      .post('/users/batch')
      .send({ users: 'not-an-array' })

    expect(response.status).toBe(400)
  })
})

import { faker } from '@faker-js/faker'
import { app, createUser, setupHttpTest } from '@shared/test/http.ts'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

setupHttpTest()

describe('GET /users/:id', () => {
  it('returns the user when it exists', async () => {
    const user = await createUser()

    const response = await request(app.server).get(`/users/${user.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  })

  it('returns only the base fields (no relations)', async () => {
    const user = await createUser()

    const response = await request(app.server).get(`/users/${user.id}`)

    expect(response.body).not.toHaveProperty('profile')
    expect(response.body).not.toHaveProperty('orders')
    expect(response.body).toHaveProperty('isActive')
  })

  it('returns null when the user does not exist', async () => {
    const response = await request(app.server).get(
      `/users/${faker.string.uuid()}`,
    )

    expect(response.status).toBe(200)
    expect(response.body).toBeNull()
  })

  it('returns 400 when the id is not a valid uuid', async () => {
    const response = await request(app.server).get('/users/invalid-id')

    expect(response.status).toBe(400)
  })

  it('returns 400 when the id is a number', async () => {
    const response = await request(app.server).get('/users/123')

    expect(response.status).toBe(400)
  })
})

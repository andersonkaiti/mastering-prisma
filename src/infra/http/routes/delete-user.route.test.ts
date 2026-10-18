import { faker } from '@faker-js/faker'
import { prisma } from '@infra/database/prisma/index.ts'
import { app, createUser, setupHttpTest } from '@shared/test/http.ts'
import { makeProfile } from '@shared/utils/make-profile.ts'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

setupHttpTest()

describe('DELETE /users/:id', () => {
  it('deletes the user and returns it', async () => {
    const user = await createUser()

    const response = await request(app.server).delete(`/users/${user.id}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({ id: user.id })

    const deleted = await prisma.user.findUnique({ where: { id: user.id } })
    expect(deleted).toBeNull()
  })

  it('cascades the deletion to the related profile', async () => {
    const user = await createUser({ profile: { create: makeProfile() } })

    await request(app.server).delete(`/users/${user.id}`)

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })
    expect(profile).toBeNull()
  })

  it('returns 400 when the id is not a valid uuid', async () => {
    const response = await request(app.server).delete('/users/invalid-id')

    expect(response.status).toBe(400)
  })

  it('returns 500 when deleting a non-existent user', async () => {
    const response = await request(app.server).delete(
      `/users/${faker.string.uuid()}`,
    )

    expect(response.status).toBe(500)
  })
})

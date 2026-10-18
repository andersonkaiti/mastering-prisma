import { prisma } from '@infra/database/prisma/index.ts'
import { app, createUser, setupHttpTest } from '@shared/test/http.ts'
import { makeOrder } from '@shared/utils/make-order.ts'
import { makeProduct } from '@shared/utils/make-product.ts'
import { makeProfile } from '@shared/utils/make-profile.ts'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

setupHttpTest()

describe('GET /users', () => {
  it('returns an empty array when there are no users', async () => {
    const response = await request(app.server).get('/users')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  it('returns every created user', async () => {
    await createUser()
    await createUser()
    await createUser()

    const response = await request(app.server).get('/users')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
  })

  it('returns null relations for a user without any', async () => {
    const user = await createUser()

    const response = await request(app.server).get('/users')

    const [created] = response.body
    expect(created.id).toBe(user.id)
    expect(created.profile).toBeNull()
    expect(created.affiliated).toBeNull()
    expect(created.orders).toEqual([])
    expect(created.affiliations).toEqual([])
  })

  it('returns the profile and the affiliation graph', async () => {
    const affiliate = await createUser()
    const user = await createUser({
      affiliated: { connect: { id: affiliate.id } },
      profile: { create: makeProfile() },
    })

    const response = await request(app.server).get('/users')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)

    const createdUser = response.body.find(
      (item: { id: string }) => item.id === user.id,
    )
    expect(createdUser).toMatchObject({
      id: user.id,
      name: user.name,
      affiliationId: affiliate.id,
      affiliated: { id: affiliate.id },
    })
    expect(createdUser.profile).not.toBeNull()

    const createdAffiliate = response.body.find(
      (item: { id: string }) => item.id === affiliate.id,
    )
    expect(createdAffiliate.affiliations).toHaveLength(1)
    expect(createdAffiliate.affiliations[0].id).toBe(user.id)
  })

  it('returns the orders with their products and quantity', async () => {
    const product = await prisma.product.create({ data: makeProduct() })
    const user = await createUser({
      orders: {
        create: {
          ...makeOrder(),
          products: {
            create: {
              quantity: 3,
              product: { connect: { id: product.id } },
            },
          },
        },
      },
    })

    const response = await request(app.server).get('/users')

    const [created] = response.body
    expect(created.id).toBe(user.id)
    expect(created.orders).toHaveLength(1)
    expect(created.orders[0].products).toHaveLength(1)
    expect(created.orders[0].products[0]).toMatchObject({
      quantity: 3,
      product: { id: product.id, name: product.name },
    })
  })
})

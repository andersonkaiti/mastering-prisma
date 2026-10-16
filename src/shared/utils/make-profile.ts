import { faker } from '@faker-js/faker'

export function makeProfile() {
  return {
    instagram: faker.helpers.maybe(() => `@${faker.internet.username()}`, {
      probability: 0.8,
    }),
    github: faker.helpers.maybe(() => faker.internet.username(), {
      probability: 0.8,
    }),
    bio: faker.helpers.maybe(() => faker.person.bio(), {
      probability: 0.8,
    }),
  }
}

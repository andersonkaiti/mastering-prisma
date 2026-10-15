import { faker } from '@faker-js/faker'

export function makeUser() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    name: `${firstName} ${lastName}`,
    email: faker.helpers.maybe(
      () => faker.internet.email({ firstName, lastName }),
      { probability: 0.8 },
    ),
    birthdate: faker.helpers.maybe(
      () => faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
      { probability: 0.8 },
    ),
    isActive: faker.datatype.boolean({ probability: 0.7 }),
  }
}

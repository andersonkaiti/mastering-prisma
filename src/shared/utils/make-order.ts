import { faker } from '@faker-js/faker'

export function makeOrder() {
  return {
    value: faker.number.int({ min: 1000, max: 500_000 }),
  }
}

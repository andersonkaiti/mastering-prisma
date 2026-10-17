import { faker } from '@faker-js/faker'

export function makeProduct() {
  return {
    name: faker.commerce.productName(),
  }
}

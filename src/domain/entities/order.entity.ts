import type { IProduct } from './product.entity.ts'

export interface IOrder {
  id: string
  userId: string
  value: number
}

export interface IOrderWithProducts extends IOrder {
  products: IProduct[]
}

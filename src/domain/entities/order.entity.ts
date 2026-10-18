import type { IProduct } from './product.entity.ts'

export interface IOrder {
  id: string
  userId: string
  value: number
}

export interface IOrderProduct {
  orderId: string
  productId: string
  quantity: number
  product: IProduct
}

export interface IOrderWithProducts extends IOrder {
  products: IOrderProduct[]
}

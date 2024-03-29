import { CouponRepository } from "./repositories/coupon-repository.ts";
import { ProductRepository } from './repositories/product-repository.ts'
import { validateCPF } from "./validate-cpf.ts";

type OrderItem = {
  id: string
  quantity: number
}

export type CheckoutInput = {
  customerDocument: string
  items: OrderItem[]
  coupon?: string
}

export class Checkout {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async execute(input: CheckoutInput) {
    const isValid = validateCPF(input.customerDocument)

    if (!isValid) {
      throw new Error('Invalid Customer Document')
    }
    
    const distance = 1000
    const knownItems: string[] = []
    const values = {
      total: 0,
      freight: 0,
      code: `${new Date().getFullYear()}0000001`
    }

    for (const orderItem of input.items) {
      if (orderItem.quantity <= 0) {
        throw new Error('Invalid Product Quantity')
      }
      
      const item = await this.productRepository.getById(orderItem.id)

      if (!item) {
        throw new Error('Invalid Product ID')
      }

      if (knownItems.includes(item.id)) {
        throw new Error('Cannot add the same product multiple times')
      }

      knownItems.push(item.id)
      const { dimension, weight } = item
      const volume = dimension.height * dimension.width * dimension.depth
      const density = weight / volume
      const itemFreight = (distance * volume * (density / 100)) * orderItem.quantity
      const finalPrice = item.price * orderItem.quantity

      values.total += finalPrice
      values.freight += itemFreight < 10 ? 10 : itemFreight
    }

    if (input.coupon) {
      const coupon = await this.couponRepository.getByCode(input.coupon)

      if (!coupon) {
        throw new Error('Invalid Coupon Code')
      }

      if (new Date(coupon.expiresIn) >= new Date()) {
        const descont = values.total * (coupon.percentage / 100)
        values.total -= descont
      }
    }

    values.total += values.freight

    return values
  }
}

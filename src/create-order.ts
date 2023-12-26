import { validateCPF } from "./validate-cpf.ts";

type OrderItem = {
  description: string
  price: number
  quantity: number
}

type Coupon = {
  name: string
  percentage: number
}

export type Order = {
  customerDocument: string
  items: OrderItem[]
  coupon?: Coupon
}

export function createOrder(order: Order) {
  const isValid = validateCPF(order.customerDocument)

  if (!isValid) {
    throw new Error('Invalid Customer Document')
  }

  const fullPrice = order.items.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)

  if (order.coupon) {
    const descont = fullPrice * (order.coupon.percentage / 100)
    return fullPrice - descont
  }

  return fullPrice
}

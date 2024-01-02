import { validateCPF } from "./validate-cpf.ts";

type OrderItem = {
  id: string
  quantity: number
}

export type Order = {
  customerDocument: string
  items: OrderItem[]
  coupon?: string
}

const items = [
  {
    id: 'product_1',
    price: 10,
    description: 'Product A'
  },
  {
    id: 'product_2',
    price: 15,
    description: 'Product B'
  }
]

const coupons = [
  {
    code: '10OFF',
    percentage: 10
  }
]

export function createOrder(order: Order) {
  const isValid = validateCPF(order.customerDocument)

  if (!isValid) {
    throw new Error('Invalid Customer Document')
  }

  const fullPrice = order.items.reduce((acc, orderItem) => {
    const item = items.find(i => i.id === orderItem.id)

    if (!item) {
      throw new Error('Invalid Product ID')
    }
    
    return acc + item.price * orderItem.quantity
  }, 0)

  if (order.coupon) {
    const coupon = coupons.find(c => c.code === order.coupon)

    if (!coupon) {
      throw new Error('Invalid Coupon Code')
    }

    const descont = fullPrice * (coupon.percentage / 100)
    return fullPrice - descont
  }

  return fullPrice
}

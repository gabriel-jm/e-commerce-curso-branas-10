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
    description: 'Product A',
    dimension: {
      height: 10,
      width: 20,
      depth: 20
    },
    weight: 1
  },
  {
    id: 'product_2',
    price: 15,
    description: 'Product B',
    dimension: {
      height: 15,
      width: 20,
      depth: 20
    },
    weight: 2
  }
]

const coupons = [
  {
    code: '10OFF',
    percentage: 10,
    expiresIn: '2024-04-11'
  },
  {
    code: 'expired_coupon',
    percentage: 1,
    expiresIn: '2023-11-10'
  }
]

export function createOrder(order: Order) {
  const isValid = validateCPF(order.customerDocument)

  if (!isValid) {
    throw new Error('Invalid Customer Document')
  }

  let fullPrice = order.items.reduce((acc, orderItem) => {
    if (orderItem.quantity <= 0) {
      throw new Error('Invalid Product Quantity')
    }
    
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

    if (new Date(coupon.expiresIn) < new Date()) {
      throw new Error('Provided Coupon is Expired')
    }

    const descont = fullPrice * (coupon.percentage / 100)
    fullPrice -= descont
  }

  return { total: fullPrice }
}

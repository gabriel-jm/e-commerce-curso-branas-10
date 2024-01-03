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
      height: 20,
      width: 15,
      depth: 10
    },
    weight: 1
  },
  {
    id: 'product_2',
    price: 15,
    description: 'Product B',
    dimension: {
      height: 100,
      width: 30,
      depth: 10
    },
    weight: 3
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

  // let fullPrice = order.items.reduce((acc, orderItem) => {
  //   if (orderItem.quantity <= 0) {
  //     throw new Error('Invalid Product Quantity')
  //   }
    
  //   const item = items.find(i => i.id === orderItem.id)

  //   if (!item) {
  //     throw new Error('Invalid Product ID')
  //   }
    
  //   return acc + item.price * orderItem.quantity
  // }, 0)

  const distance = 1000

  const values = order.items.reduce((acc, orderItem) => {
    if (orderItem.quantity <= 0) {
      throw new Error('Invalid Product Quantity')
    }
    
    const item = items.find(i => i.id === orderItem.id)

    if (!item) {
      throw new Error('Invalid Product ID')
    }

    const { dimension, weight } = item
    const volume = dimension.height * dimension.width * dimension.depth
    const density = weight / volume
    const itemFreight = distance * volume * (density / 100)
    const finalPrice = item.price * orderItem.quantity

    return {
      total: acc.total + finalPrice,
      freight: acc.freight + (itemFreight < 10 ? 10 : itemFreight)
    }
  }, { total: 0, freight: 0 })

  if (order.coupon) {
    const coupon = coupons.find(c => c.code === order.coupon)

    if (!coupon) {
      throw new Error('Invalid Coupon Code')
    }

    if (new Date(coupon.expiresIn) < new Date()) {
      throw new Error('Provided Coupon is Expired')
    }

    const descont = values.total * (coupon.percentage / 100)
    values.total -= descont
  }

  return values
}

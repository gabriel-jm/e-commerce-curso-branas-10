import { afterAll, beforeAll, describe, it } from "std/testing/bdd.ts";
import { FakeTime } from 'std/testing/time.ts'
import { Order, createOrder } from "../src/create-order.ts";
import { assertEquals, assertThrows } from "std/assert/mod.ts";

const sut = (order: Order) => createOrder(order)
let fakeTime: FakeTime

beforeAll(() => {
  fakeTime = new FakeTime('2024-02-01')
})

afterAll(() => {
  fakeTime.restore()
})

describe('createOrder', () => {
  it('should throw an error if receive an invalid CPF', () => {
    const fakeOrder = {
      customerDocument: '123',
      items: []
    }
    
    assertThrows(() => sut(fakeOrder), 'Invalid Customer Document')
  })

  it('should return 0 for an empty order', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: []
    }

    const result = sut(fakeOrder)

    assertEquals(result.total, 0)
  })

  it('should throw an error for invalid product id', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'invalid_product',
          quantity: 1
        }
      ]
    }

    assertThrows(() => sut(fakeOrder), 'Invalid Product ID')
  })

  it('should throw an error if has repeated products in order', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 1
        },
        {
          id: 'product_1',
          quantity: 1
        }
      ]
    }

    assertThrows(() => sut(fakeOrder), 'Cannot add the same product multiple times')
  })

  it('should throw an error for invalid product quantity', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: -1
        }
      ]
    }

    assertThrows(() => sut(fakeOrder), 'Invalid Product Quantity')
  })

  it('should return the correct final price for the order', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 3
        },
        {
          id: 'product_2',
          quantity: 4
        }
      ]
    }

    const result = sut(fakeOrder)

    assertEquals(result.total, 240)
  })

  it('should throw an error for invalid coupon code', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 1
        }
      ],
      coupon: 'invalid_coupon'
    }

    assertThrows(() => sut(fakeOrder), 'Invalid Coupon Code')
  })

  it('should not apply the descont if the wanted coupon is expired', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 3
        },
        {
          id: 'product_2',
          quantity: 4
        }
      ],
      coupon: 'expired_coupon'
    }
    
    const result = sut(fakeOrder)

    assertEquals(result.total, 240)
  })

  it('should return the correct final price for an order with descont', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 3
        },
        {
          id: 'product_2',
          quantity: 4
        }
      ],
      coupon: '10OFF'
    }

    const result = sut(fakeOrder)

    assertEquals(result.total, 231)
  })

  it('should calculate the correct freight value', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 3
        },
        {
          id: 'product_2',
          quantity: 4
        }
      ]
    }

    const result = sut(fakeOrder)

    assertEquals(result.freight, 150)
    assertEquals(result.total, 240)
  })

  it('should consider the minimum freight', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 1
        }
      ]
    }

    const result = sut(fakeOrder)

    assertEquals(result.freight, 10)
    assertEquals(result.total, 20)
  })
})

import { describe, it } from "std/testing/bdd.ts";
import { Order, createOrder } from "../src/create-order.ts";
import { assertEquals, assertThrows } from "std/assert/mod.ts";

const sut = (order: Order) => createOrder(order)

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

    const finalPrice = sut(fakeOrder)

    assertEquals(finalPrice, 0)
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

    const finalPrice = sut(fakeOrder)

    assertEquals(finalPrice, 90)
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

    const finalPrice = sut(fakeOrder)

    assertEquals(finalPrice, 81)
  })
})

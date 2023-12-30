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

  it('should return 0 for empty an order', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: []
    }

    const finalPrice = sut(fakeOrder)

    assertEquals(finalPrice, 0)
  })

  it('should return the correct final price for the order', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          description: 'any description',
          price: 10,
          quantity: 3
        },
        {
          description: 'any description',
          price: 25,
          quantity: 4
        }
      ]
    }

    const finalPrice = sut(fakeOrder)

    assertEquals(finalPrice, 130)
  })

  it('should return the correct final price for an order with descont', () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          description: 'any description',
          price: 10,
          quantity: 3
        },
        {
          description: 'any description',
          price: 25,
          quantity: 4
        }
      ],
      coupon: {
        name: '10% OFF',
        percentage: 10
      }
    }

    const finalPrice = sut(fakeOrder)

    assertEquals(finalPrice, 117)
  })
})

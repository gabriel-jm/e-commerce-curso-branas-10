import { afterAll, beforeAll, describe, it } from "std/testing/bdd.ts";
import { FakeTime } from 'std/testing/time.ts'
import { assertEquals, assertRejects } from "std/assert/mod.ts";
import { Checkout } from "../src/checkout.ts";

function makeSut() {
  const sut = new Checkout()
  return sut
}
let fakeTime: FakeTime

beforeAll(() => {
  fakeTime = new FakeTime('2024-02-01')
})

afterAll(() => {
  fakeTime.restore()
})

describe('Checkout', () => {
  it('should throw an error if receive an invalid CPF', () => {
    const fakeOrder = {
      customerDocument: '123',
      items: []
    }
    
    const sut = makeSut()

    assertRejects(() => sut.execute(fakeOrder), 'Invalid Customer Document')
  })

  it('should return 0 for an empty order', async () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: []
    }

    const sut = makeSut()
    const result = await sut.execute(fakeOrder)

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

    const sut = makeSut()

    assertRejects(() => sut.execute(fakeOrder), 'Invalid Product ID')
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

    const sut = makeSut()

    assertRejects(() => sut.execute(fakeOrder), 'Cannot add the same product multiple times')
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

    const sut = makeSut()

    assertRejects(() => sut.execute(fakeOrder), 'Invalid Product Quantity')
  })

  it('should return the correct final price for the order', async () => {
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

    const sut = makeSut()
    const result = await sut.execute(fakeOrder)

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

    const sut = makeSut()

    assertRejects(() => sut.execute(fakeOrder), 'Invalid Coupon Code')
  })

  it('should not apply the descont if the wanted coupon is expired', async () => {
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
    
    const sut = makeSut()
    const result = await sut.execute(fakeOrder)

    assertEquals(result.total, 240)
  })

  it('should return the correct final price for an order with descont', async () => {
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

    const sut = makeSut()
    const result = await sut.execute(fakeOrder)

    assertEquals(result.total, 231)
  })

  it('should calculate the correct freight value', async () => {
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

    const sut = makeSut()
    const result = await sut.execute(fakeOrder)

    assertEquals(result.freight, 150)
    assertEquals(result.total, 240)
  })

  it('should consider the minimum freight', async () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 1
        }
      ]
    }

    const sut = makeSut()
    const result = await sut.execute(fakeOrder)

    assertEquals(result.freight, 10)
    assertEquals(result.total, 20)
  })
})

import { afterAll, beforeAll, describe, it } from "std/testing/bdd.ts";
import { stub, returnsNext } from 'std/testing/mock.ts'
import { FakeTime } from 'std/testing/time.ts'
import { assertEquals, assertRejects } from "std/assert/mod.ts";
import { Checkout } from "../src/checkout.ts";

function makeSut() {
  const fakeCouponRepository = {
    result: {
      code: '10OFF',
      percentage: 10,
      expiresIn: '2024-04-11'    
    },
    getByCode: () => Promise.resolve(fakeCouponRepository.result)
  }
  const fakeProductRepository = {
    result: {
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
    getById: () => Promise.resolve(fakeProductRepository.result)
  }
  const sut = new Checkout(fakeCouponRepository, fakeProductRepository)
  return {
    sut,
    fakeCouponRepository,
    fakeProductRepository
  }
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
    
    const { sut } = makeSut()

    assertRejects(() => sut.execute(fakeOrder), 'Invalid Customer Document')
  })

  it('should return 0 for an empty order', async () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: []
    }

    const { sut } = makeSut()
    const result = await sut.execute(fakeOrder)

    assertEquals(result.total, 0)
  })

  it('should throw an error for invalid product id', async () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'invalid_product',
          quantity: 1
        }
      ]
    }

    const { sut, fakeProductRepository } = makeSut()
    const repositoryStub = stub(fakeProductRepository, 'getById', returnsNext([
      Promise.resolve(undefined) as any
    ]))

    await assertRejects(() => sut.execute(fakeOrder), 'Invalid Product ID')

    repositoryStub.restore()
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

    const { sut } = makeSut()

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

    const { sut } = makeSut()

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

    const { sut, fakeProductRepository } = makeSut()
    const repositoryStub = stub(fakeProductRepository, 'getById', returnsNext([
      Promise.resolve(fakeProductRepository.result),
      Promise.resolve({
        id: 'product_2',
        price: 15,
        description: 'Product B',
        dimension: {
          height: 100,
          width: 30,
          depth: 10
        },
        weight: 3
      })
    ]))

    const result = await sut.execute(fakeOrder)

    assertEquals(result.total, 240)
    repositoryStub.restore()
  })

  it('should throw an error for invalid coupon code', async () => {
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

    const { sut, fakeCouponRepository } = makeSut()
    const repositoryStub = stub(fakeCouponRepository, 'getByCode', returnsNext([
      Promise.resolve(undefined) as any
    ]))

    await assertRejects(() => sut.execute(fakeOrder), 'Invalid Coupon Code')

    repositoryStub.restore()
  })

  it('should not apply the descont if the wanted coupon is expired', async () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 3
        }
      ],
      coupon: 'expired_coupon'
    }
    
    const { sut } = makeSut()
    const result = await sut.execute(fakeOrder)

    assertEquals(result.total, 57)
  })

  it('should return the correct final price for an order with descont', async () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 3
        }
      ],
      coupon: '10OFF'
    }

    const { sut } = makeSut()
    const result = await sut.execute(fakeOrder)

    assertEquals(result.total, 57)
  })

  it('should calculate the correct freight value', async () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 3
        }
      ]
    }

    const { sut } = makeSut()
    const result = await sut.execute(fakeOrder)

    assertEquals(result.freight, 30)
    assertEquals(result.total, 60)
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

    const { sut } = makeSut()
    const result = await sut.execute(fakeOrder)

    assertEquals(result.freight, 10)
    assertEquals(result.total, 20)
  })

  it('should return the order\'s code', async () => {
    const fakeOrder = {
      customerDocument: '347.867.458-12',
      items: [
        {
          id: 'product_1',
          quantity: 1
        }
      ]
    }

    const { sut } = makeSut()
    const result = await sut.execute(fakeOrder)

    assertEquals(result.code, '20240000001')
  })
})

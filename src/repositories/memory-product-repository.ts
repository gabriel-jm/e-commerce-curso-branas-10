import { ProductRepository } from './product-repository.ts'

const products = [
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

export class MemoryProductRepository implements ProductRepository {
  getById(id: string) {
    return Promise.resolve(products.find(i => i.id === id))
  }
}

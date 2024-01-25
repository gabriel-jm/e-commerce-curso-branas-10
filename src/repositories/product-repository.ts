export interface ProductModel {
  id: string
  price: number
  description: string
  dimension: {
    height: number
    width: number
    depth: number
  },
  weight: number
}

export interface ProductRepository {
  getById(id: string): Promise<ProductModel | undefined>
}

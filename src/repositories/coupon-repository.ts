export interface CouponModel {
  code: string
  percentage: number
  expiresIn: string
}

export interface CouponRepository {
  getByCode(code: string): Promise<CouponModel | undefined>
}

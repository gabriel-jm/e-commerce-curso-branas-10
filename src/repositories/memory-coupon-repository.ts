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

export class MemoryCouponRepository {
  getByCode(code: string) {
    return Promise.resolve(coupons.find(c => c.code === code))
  }
}

import { describe, it } from "std/testing/bdd.ts";
import { validateCPF } from "../src/validate-cpf.ts";
import { assertEquals } from "std/assert/mod.ts";

const sut = (data: string) => validateCPF(data)

describe('validateCPF', () => {
  it('should return false if the cpf is less than 11 digits', () => {
    assertEquals(sut('1234'), false)
  })

  it('should return false if the cpf is greater than 14 digits', () => {
    assertEquals(sut('123.456.789-123456'), false)
  })

  it('should return false if all numbers are equals', () => {
    assertEquals(sut('11111111111'), false)
  })

  it('should accept dots, dashes and spaces in the cpf', () => {
    assertEquals(sut(' 347.867.458-12 '), true)
  })

  it('should return false if as any invalid character', () => {
    assertEquals(sut('347.867.4a8-12'), false)
  })

  it('should return false for invalid cpfs', () => {
    assertEquals(sut('123.456.789-00'), false)
  })

  it('should return true for valid cpfs', () => {
    assertEquals(sut('347.867.458-12'), true)
  })
})

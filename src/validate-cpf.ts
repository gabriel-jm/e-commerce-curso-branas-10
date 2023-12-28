export function validateCPF(rawCPF: string) {
  if (!rawCPF) return false

  const sanitizedCPF = rawCPF.replace(/\D+/g, '')
  const cpfLength = sanitizedCPF.length

  if (cpfLength < 9 && cpfLength > 11 || areAllEqual(sanitizedCPF)) {
    return false
  }

  const firstDigit = calculateDigit(sanitizedCPF, 10)
  const secondDigit = calculateDigit(sanitizedCPF, 11)

  const verificationDigit = sanitizedCPF.substring(sanitizedCPF.length-2)
  const verificationDigitFound = `${firstDigit}${secondDigit}`
  
  return verificationDigit === verificationDigitFound
}

function areAllEqual(cpf: string) {
  const firstNumber = cpf[0]
  return cpf
    .split("")
    .every(char => char === firstNumber)
}

function calculateDigit(cpf: string, factor: number) {
  let total = 0

  for (const digit of cpf) {
    if (factor > 1) {
      total += parseInt(digit) * factor--
    }
  }

  const rest = total % 11

  return rest < 2 ? 0 : 11 - rest
}

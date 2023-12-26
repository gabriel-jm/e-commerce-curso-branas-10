export function validateCPF(rawCPF: string) {
  const sanitizedCPF = rawCPF.replace(/[\.\-\s]+/g, '')
  const cpfLength = sanitizedCPF.length

  if (cpfLength < 9 || cpfLength > 11 || areAllEqual(sanitizedCPF)) {
    return false
  }

  let firstDigitCount = 0
  let secondDigitCount = 0
      
  for (let count = 1; count < sanitizedCPF.length - 1; count++) {
    const currentNumber = parseInt(sanitizedCPF[count - 1])

    if (isNaN(currentNumber)) return false

    const firstMultiplier = 11 - count
    const secondMultiplier = 12 - count
    
    firstDigitCount = firstDigitCount + firstMultiplier * currentNumber  
    secondDigitCount = secondDigitCount + secondMultiplier * currentNumber  
  }
      
  const firstDigitRest = (firstDigitCount % 11)
  const firstDigit = (firstDigitRest < 2) ? 0 : 11 - firstDigitRest
  
  secondDigitCount += 2 * firstDigit
  const secondDigitRest = (secondDigitCount % 11)
  const secondDigit = (secondDigitRest < 2) ? 0 : 11 - secondDigitRest

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

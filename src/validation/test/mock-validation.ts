import { Validation } from '@/presentation/protocols'

const mockValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

export { mockValidation }

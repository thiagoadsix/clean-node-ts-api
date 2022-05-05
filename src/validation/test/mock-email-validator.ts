import { EmailValidator } from '@/validation/protocols/email-validator'

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

export { mockEmailValidator }

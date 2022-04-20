import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'

import { Validation } from '@/presentation/protocols'

import {
  ValidationComposite,
  EmailValidation,
  RequiredFieldValidation,
  CompareFieldsValidation
} from '@/validation/validators'

export const makeSignupValidationFactory = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}

import { InvalidParamError } from '@/presentation/errors'

import { EmailValidator } from '@/validation/protocols/email-validator'

import { EmailValidation } from './email-validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface MakeSutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): MakeSutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('EmailValidation', () => {
  test('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()

    // Spying function
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'email@example.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    // Spying function
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.validate({ email: 'email@example.com' })
    expect(isValidSpy).toHaveBeenCalledWith('email@example.com')
  })

  test('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    // Mocking implementation of the function
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    // How it is a sync function...
    expect(sut.validate).toThrow()
  })
})

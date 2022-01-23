import { SignUpController } from './signup'
import { EmailValidator } from '../protocols'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'

import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { AccountModel } from '../../domain/models/account'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: '1',
        name: 'name',
        email: 'email@example.com',
        password: 'password'
      }

      return fakeAccount
    }
  }

  return new AddAccountStub()
}

interface MakeSutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): MakeSutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', () => {
    // System Under Test -> sut
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if passwordConfirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    // Mocking return of the function
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    // Spying function
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('email@example.com')
  })

  test('should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    // Mocking implementation of the function
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()

    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@example.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    }
    sut.handle(httpRequest)
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    })
  })
})

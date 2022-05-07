import {
  EmailInUseError,
  ServerError
} from '@/presentation/errors'
import {
  ok,
  badRequest,
  serverError,
  forbidden
} from '@/presentation/helpers'

import {
  AddAccount,
  Authentication,
  HttpRequest,
  HttpResponse,
  Validation
} from './signup-controller-protocols'

import { throwError } from '@/domain/test'

import { SignUpController } from './signup-controller'

import { mockAddAccount, mockAuthentication, mockValidation } from '@/presentation/test'

const mockSignupRequest = (): HttpRequest => ({
  body: {
    name: 'name',
    email: 'email@example.com',
    password: 'password',
    passwordConfirmation: 'password'
  }
})

type MakeSutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): MakeSutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  test('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = mockSignupRequest()
    await sut.handle(httpRequest)
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'name',
      email: 'email@example.com',
      password: 'password'
    })
  })

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementationOnce(async () => {
        return await Promise.reject(new Error())
      })

    const httpRequest = mockSignupRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockSignupRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockSignupRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'token' }))
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockSignupRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockSignupRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockSignupRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'email@example.com', password: 'password' })
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    // Will replace all implementation of the method
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse: HttpResponse = await sut.handle(mockSignupRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

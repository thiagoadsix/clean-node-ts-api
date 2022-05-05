import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@/presentation/helpers'
import { mockAuthentication, mockValidation } from '@/presentation/test'

import {
  Authentication,
  Validation,
  HttpRequest,
  HttpResponse
} from './login-controller-protocols'

import { LoginController } from './login-controller'
import { throwError } from '@/domain/test'

type MakeSutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): MakeSutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const mockLoginRequest = (): HttpRequest => ({
  body: {
    email: 'email@example.com',
    password: 'password'
  }
})

describe('Login Controller', () => {
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockLoginRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'email@example.com', password: 'password' })
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse: HttpResponse = await sut.handle(mockLoginRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    // Will replace all implementation of the method
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse: HttpResponse = await sut.handle(mockLoginRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid credentials ar provided', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(mockLoginRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'token' }))
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockLoginRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(mockLoginRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})

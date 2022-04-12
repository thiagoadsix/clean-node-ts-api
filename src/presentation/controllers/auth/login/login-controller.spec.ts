import {
  Authentication,
  Validation,
  HttpRequest,
  HttpResponse,
  AuthenticationModel
} from './login-controller-protocols'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers'
import { LoginController } from './login-controller'

interface MakeSutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): MakeSutTypes => {
  const authenticationStub = makeAuthentication()
  const validationStub = makeValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return {
    sut,
    authenticationStub,
    validationStub
  }
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return await new Promise<string>((resolve) => resolve('token'))
    }
  }

  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

const makeFakeLoginRequest = (): HttpRequest => ({
  body: {
    email: 'email@example.com',
    password: 'password'
  }
})

describe('Login Controller', () => {
  test('should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(makeFakeLoginRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'email@example.com', password: 'password' })
  })

  test('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse: HttpResponse = await sut.handle(makeFakeLoginRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    // Will replace all implementation of the method
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse: HttpResponse = await sut.handle(makeFakeLoginRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 200 if valid credentials ar provided', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(makeFakeLoginRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'token' }))
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeLoginRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeLoginRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })
})

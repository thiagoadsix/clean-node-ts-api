import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'

import {
  AccountModel,
  LoadAccountByToken,
  HttpRequest
} from './auth-middleware-protocols'

import { AuthMiddleware } from './auth-middleware'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

const makeFakeAccountResponse = (): AccountModel => ({
  id: 'any id',
  name: 'any name',
  email: 'any@email.com',
  password: 'any password'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any token'
  }
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return new Promise<AccountModel>(resolve => resolve(makeFakeAccountResponse()))
    }
  }

  return new LoadAccountByTokenStub()
}

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token is provided in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct x-access-token', async () => {
    const role = 'any role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith('any token', role)
  })

  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any id' }))
  })

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

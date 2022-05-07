import {
  forbidden,
  ok,
  serverError
} from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'

import {
  LoadAccountByToken,
  HttpRequest
} from './auth-middleware-protocols'

import { throwError } from '@/domain/test'

import { AuthMiddleware } from './auth-middleware'
import { mockLoadAccountByToken } from '@/presentation/test'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

const mockAuthMiddlewareRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any token'
  }
})

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
    const httpRequest: HttpRequest = mockAuthMiddlewareRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith('any token', role)
  })

  test('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(mockAuthMiddlewareRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockAuthMiddlewareRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockAuthMiddlewareRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

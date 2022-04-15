import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'

import { HttpRequest } from '../protocols'
import { forbidden } from '../helpers'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthMiddleware(loadAccountByTokenStub)

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
    async load (accessToken: string, role: string): Promise<AccountModel> {
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
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadAccountByTokenSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest: HttpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(loadAccountByTokenSpy).toHaveBeenCalledWith('any token')
  })
})

import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

import {
  Controller,
  HttpRequest,
  HttpResponse
} from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers'

import { mockAccountResponse } from '@/domain/test'
import { mockLogErrorRepository } from '@/data/test'

import { LogControllerDecorator } from './log-controller-decorator'

type MakeSutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): MakeSutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return ok(mockAccountResponse())
    }
  }

  return new ControllerStub()
}

const makeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any-stack'
  return serverError(fakeError)
}

const makeFakeAccountRequest = (): HttpRequest => ({
  body: {
    name: 'name',
    email: 'email@example.com',
    password: 'password',
    passwordConfirmation: 'password'
  }
})

describe('LogController Decorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeAccountRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeAccountRequest())
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeAccountRequest())
    expect(httpResponse).toEqual(ok(mockAccountResponse()))
  })

  test('should call LogErrorRepository with correct error if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(makeServerError()))
    await sut.handle(makeFakeAccountRequest())
    expect(logSpy).toHaveBeenCalledWith('any-stack')
  })
})

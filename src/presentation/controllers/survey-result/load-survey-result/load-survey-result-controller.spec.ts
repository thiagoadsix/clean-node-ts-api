import MockDate from 'mockdate'

import { InvalidParamError } from '@/presentation/errors'
import { mockLoadSurveyById } from '@/presentation/test'

import { forbidden, HttpRequest, LoadSurveyById, serverError } from './load-survey-result-controller-protocols'

import { LoadSurveyResultController } from './load-survey-result-controller'
import { throwError } from '@/domain/test'

const mockLoadSurveyResultRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = mockLoadSurveyById()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockLoadSurveyResultRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return 403 if LoadSurveyById return null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(mockLoadSurveyResultRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    // Will replace all implementation of the method
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockLoadSurveyResultRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})

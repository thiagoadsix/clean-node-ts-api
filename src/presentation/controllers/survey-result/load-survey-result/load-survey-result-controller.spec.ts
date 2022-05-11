import MockDate from 'mockdate'

import { mockLoadSurveyById } from '@/presentation/test'

import { HttpRequest } from './load-survey-result-controller-protocols'

import { LoadSurveyResultController } from './load-survey-result-controller'

const mockLoadSurveyResultRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_id'
  }
})

describe('LoadSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyById with correct value', async () => {
    const loadSurveyByIdStub = mockLoadSurveyById()
    const sut = new LoadSurveyResultController(loadSurveyByIdStub)
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(mockLoadSurveyResultRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })
})

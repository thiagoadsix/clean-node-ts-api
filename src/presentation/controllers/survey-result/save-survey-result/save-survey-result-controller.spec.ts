import MockDate from 'mockdate'

import { InvalidParamError } from '@/presentation/errors'

import { SaveSurveyResultController } from './save-survey-result-controller'

import { forbidden, HttpRequest, LoadSurveyById, SaveSurveyResult, SaveSurveyResultModel, serverError, SurveyModel, SurveyResultModel } from './save-survey-result-controller-protocols'

const makeFakeLoadSurveyByIdRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any id'
  },
  body: {
    answer: 'any answer'
  },
  accountId: 'any account id'
})

const makeFakeLoadSurveyByIdResponse = (): SurveyModel => ({
  id: 'any id',
  question: 'any question',
  answers: [{
    answer: 'any answer',
    image: 'any image'
  }],
  date: new Date()
})

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise<SurveyModel>((resolve) => resolve(makeFakeLoadSurveyByIdResponse()))
    }
  }

  return new LoadSurveyByIdStub()
}

const makeFakeSaveSurveyResultResponse = (): SurveyResultModel => ({
  id: 'any id',
  accountId: 'any account id',
  surveyId: 'any survey id',
  answer: 'any answer',
  date: new Date()
})

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise<SurveyResultModel>((resolve) => resolve(makeFakeSaveSurveyResultResponse()))
    }
  }

  return new SaveSurveyResultStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  loadSurveyByIdStub: LoadSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdStub = makeLoadSurveyById()
  const saveSurveyResultStub = makeSaveSurveyResult()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    await sut.handle(makeFakeLoadSurveyByIdRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith(makeFakeLoadSurveyByIdRequest().params.surveyId)
  })

  test('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const httpResponse = await sut.handle(makeFakeLoadSurveyByIdRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(serverError(new Error()))))
    const httpResponse = await sut.handle(makeFakeLoadSurveyByIdRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      params: {
        surveyId: 'any id'
      },
      body: {
        answer: 'wrong answer'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    await sut.handle(makeFakeLoadSurveyByIdRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any id',
      accountId: 'any account id',
      answer: 'any answer',
      date: new Date()
    })
  })
})

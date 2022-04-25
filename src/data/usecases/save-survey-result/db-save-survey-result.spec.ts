import MockDate from 'mockdate'

import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols'

import { DbSaveSurveyResult } from './db-save-survey-result'

const makeFakeSaveSurveyRequestData = (): SaveSurveyResultModel => ({
  accountId: 'any account id',
  surveyId: 'any survey id',
  answer: 'any answer',
  date: new Date()
})

const makeFakeSaveSurveyResultData = (): SurveyResultModel => ({
  id: 'any id',
  accountId: 'any account id',
  surveyId: 'any survey id',
  answer: 'any answer',
  date: new Date()
})

const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return await new Promise((resolve) => resolve(makeFakeSaveSurveyResultData()))
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyData = makeFakeSaveSurveyRequestData()
    await sut.save(surveyData)
    expect(saveSpy).toHaveBeenCalledWith(surveyData)
  })
})

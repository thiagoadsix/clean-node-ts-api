import MockDate from 'mockdate'

import {
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols'

import { DbSaveSurveyResult } from './db-save-survey-result'

const makeFakeSaveSurveyRequestData = (): SaveSurveyResultParams => ({
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
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
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

  test('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    // Dependency is returning a exception
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    // Remove the await here
    const promise = sut.save(makeFakeSaveSurveyRequestData())
    // To catch the error here
    await expect(promise).rejects.toThrow()
  })

  test('should return a SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.save(makeFakeSaveSurveyRequestData())
    expect(surveys).toEqual(makeFakeSaveSurveyResultData())
  })
})

import MockDate from 'mockdate'

import {
  SaveSurveyResultRepository
} from './db-save-survey-result-protocols'

import { mockSaveSurveyRequest, mockSaveSurveyResponse, throwError } from '@/domain/test'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test'

import { DbSaveSurveyResult } from './db-save-survey-result'
import { LoadSurveyResultRepository } from '../load-survey-result/db-load-survey-result-protocols'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
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
    const surveyData = mockSaveSurveyRequest()
    await sut.save(surveyData)
    expect(saveSpy).toHaveBeenCalledWith(surveyData)
  })

  test('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    // Dependency is returning a exception
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)

    // Remove the await here
    const promise = sut.save(mockSaveSurveyRequest())
    // To catch the error here
    await expect(promise).rejects.toThrow()
  })

  test('should return a SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.save(mockSaveSurveyRequest())
    expect(surveys).toEqual(mockSaveSurveyResponse())
  })

  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')
    const surveyData = mockSaveSurveyRequest()
    await sut.save(surveyData)
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith(surveyData.surveyId)
  })

  test('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    // Dependency is returning a exception
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)

    // Remove the await here
    const promise = sut.save(mockSaveSurveyRequest())
    // To catch the error here
    await expect(promise).rejects.toThrow()
  })
})

import MockDate from 'mockdate'

import {
  AddSurveyRepository
} from './db-add-survey-protocols'

import { mockSurveyRequest, throwError } from '@/domain/test'
import { mockAddSurveyRepository } from '@/data/test'

import { DbAddSurvey } from './db-add-survey'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey Usecase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSurveySpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = mockSurveyRequest()
    await sut.add(surveyData)
    expect(addSurveySpy).toHaveBeenCalledWith(surveyData)
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    // Dependency is returning a exception
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)

    // Remove the await here
    const promise = sut.add(mockSurveyRequest())
    // To catch the error here
    await expect(promise).rejects.toThrow()
  })
})

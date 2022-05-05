import MockDate from 'mockdate'

import {
  LoadSurveyByIdRepository
} from './db-load-survey-by-id-protocols'

import { mockSurveyResponse, throwError } from '@/domain/test'

import { DbLoadSurveyById } from './db-load-survey-by-id'
import { mockLoadSurveyByIdRepository } from '@/data/test'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepository: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepository = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepository)
  return {
    sut,
    loadSurveyByIdRepository
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyByIdRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepository, 'loadById')
    await sut.loadById('account id')
    expect(loadByIdSpy).toHaveBeenCalledWith('account id')
  })

  test('should return a Survey on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.loadById('account id')
    expect(surveys).toEqual(mockSurveyResponse())
  })

  test('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut()

    jest.spyOn(loadSurveyByIdRepository, 'loadById').mockImplementationOnce(throwError)

    const promise = sut.loadById('account id')
    await expect(promise).rejects.toThrow()
  })
})

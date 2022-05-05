import MockDate from 'mockdate'

import {
  LoadSurveysRepository
} from './db-load-surveys-protocols'

import { mockSurveysResponse, throwError } from '@/domain/test'

import { DbLoadSurveys } from './db-load-surveys'
import { mockLoadSurveysRepositoryStub } from '@/data/test'

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepository: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepository = mockLoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepository)
  return {
    sut,
    loadSurveysRepository
  }
}

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepository } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepository, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveysResponse())
  })

  test('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepository } = makeSut()

    jest.spyOn(loadSurveysRepository, 'loadAll').mockImplementationOnce(throwError)

    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})

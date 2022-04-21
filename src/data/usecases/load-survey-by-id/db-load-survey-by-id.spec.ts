import MockDate from 'mockdate'

import {
  LoadSurveyByIdRepository,
  SurveyModel
} from './db-load-survey-by-id-protocols'

import { DbLoadSurveyById } from './db-load-survey-by-id'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepository: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepository = makeLoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepository)
  return {
    sut,
    loadSurveyByIdRepository
  }
}

const makeLoadSurveyByIdRepositoryStub = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return new Promise<SurveyModel>((resolve) => resolve(makeFakeSurveyResponse()))
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

const makeFakeSurveyResponse = (): SurveyModel => ({
  id: 'any id',
  question: 'any question',
  answers: [{
    answer: 'any answer',
    image: 'any image'
  }],
  date: new Date()
})

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
    expect(surveys).toEqual(makeFakeSurveyResponse())
  })

  test('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepository } = makeSut()

    jest.spyOn(loadSurveyByIdRepository, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.loadById('account id')
    await expect(promise).rejects.toThrow()
  })
})

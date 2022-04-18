import MockDate from 'mockdate'

import { LoadSurveysRepository } from '../../protocols/db/survey/load-surveys-repository'
import { DbLoadSurveys } from './db-load-surveys'
import { SurveyModel } from './db-load-surveys-protocols'

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveysRepository: LoadSurveysRepository
}

const makeSut = (): SutTypes => {
  const loadSurveysRepository = makeLoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepository)
  return {
    sut,
    loadSurveysRepository
  }
}

const makeLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return new Promise<SurveyModel[]>((resolve) => resolve(makeFakeSurveysResponse()))
    }
  }

  return new LoadSurveysRepositoryStub()
}

const makeFakeSurveysResponse = (): SurveyModel[] => ([{
  id: 'any id',
  question: 'any question',
  answers: [{
    image: 'any image',
    answer: 'any answer'
  }],
  date: new Date()
}])

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
})

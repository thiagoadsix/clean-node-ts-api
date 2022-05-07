import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys-protocols'

import { mockSurveyResponse, mockSurveysResponse } from '@/domain/test'

import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddSurveyRepositoryStub()
}

const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyResponse())
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

const mockLoadSurveysRepositoryStub = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveysResponse())
    }
  }

  return new LoadSurveysRepositoryStub()
}

export { mockAddSurveyRepository, mockLoadSurveyByIdRepository, mockLoadSurveysRepositoryStub }

import { mockSurveysResponse, mockSurveyResponse } from '@/domain/test'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return Promise.resolve()
    }
  }

  return new AddSurveyStub()
}

const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveysResponse())
    }
  }

  return new LoadSurveysStub()
}

const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return Promise.resolve(mockSurveyResponse())
    }
  }

  return new LoadSurveyByIdStub()
}

export { mockAddSurvey, mockLoadSurveys, mockLoadSurveyById }

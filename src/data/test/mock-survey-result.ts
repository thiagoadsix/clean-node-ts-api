import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'

import { mockSaveSurveyResponse } from '@/domain/test'

import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSaveSurveyResponse())
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

export { mockSaveSurveyResultRepository }

import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSaveSurveyResponse } from '@/domain/test'

const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise<SurveyResultModel>((resolve) => resolve(mockSaveSurveyResponse()))
    }
  }

  return new SaveSurveyResultStub()
}

export { mockSaveSurveyResult }

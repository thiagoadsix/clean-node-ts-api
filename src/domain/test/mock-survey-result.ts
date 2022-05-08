import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

const mockSaveSurveyRequest = (): SaveSurveyResultParams => ({
  answer: 'any_answer',
  accountId: 'any_account_id',
  surveyId: 'any_survey_id',
  date: new Date()
})

const mockSaveSurveyResponse = (): SurveyResultModel => ({
  question: 'any_question',
  answers: [{
    answer: 'any answer',
    count: 1,
    percent: 50,
    image: 'any_image'

  }],
  surveyId: 'any_survey_id',
  date: new Date()
})

export { mockSaveSurveyRequest, mockSaveSurveyResponse }

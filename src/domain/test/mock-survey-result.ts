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
    answer: 'any_answer',
    count: 0,
    percent: 0,
    image: 'any_image'

  }],
  surveyId: 'any_id',
  date: new Date()
})

export { mockSaveSurveyRequest, mockSaveSurveyResponse }

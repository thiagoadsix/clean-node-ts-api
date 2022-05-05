import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { SurveyModel } from '@/domain/models/survey'

const mockSurveyRequest = (): AddSurveyParams => ({
  question: 'any question',
  answers: [{
    image: 'any_image',
    answer: 'any answer'
  }],
  date: new Date()
})

const mockSurveyResponse = (): SurveyModel => ({
  id: 'any id',
  question: 'any question',
  answers: [{
    answer: 'any answer',
    image: 'any image'
  }],
  date: new Date()
})

const mockSurveysResponse = (): SurveyModel[] => ([{
  id: 'any id',
  question: 'any question',
  answers: [{
    image: 'any image',
    answer: 'any answer'
  }],
  date: new Date()
}])

export { mockSurveyRequest, mockSurveyResponse, mockSurveysResponse }

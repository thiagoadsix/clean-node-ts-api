import { SurveyResultModel } from './survey-result-mongo-repository-protocols'

export const SurveyResultMapper = {
  surveyResultMongoToSurveyResultModel (survey: any): SurveyResultModel {
    return {
      surveyId: survey.surveyId,
      answers: survey.answers,
      question: survey.question,
      date: survey.date
    }
  }
}

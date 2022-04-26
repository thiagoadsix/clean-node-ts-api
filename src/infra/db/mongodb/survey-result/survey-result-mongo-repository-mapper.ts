import { SurveyResultModel } from './survey-result-mongo-repository-protocols'

export const SurveyResultMapper = {
  surveyResultMongoToSurveyResultModel (survey: any): SurveyResultModel {
    return {
      id: survey._id,
      accountId: survey.accountId,
      surveyId: survey.surveyId,
      answer: survey.answer,
      date: survey.date
    }
  }
}

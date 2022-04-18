import { SurveyModel } from '../../../../domain/models/survey'

export const SurveyMapper = {
  surveysMongoToSurveysModel (surveys: any[]): SurveyModel[] {
    return surveys.map(survey => ({
      id: survey._id,
      question: survey.question,
      answers: survey.answers,
      date: survey.date
    }))
  }
}

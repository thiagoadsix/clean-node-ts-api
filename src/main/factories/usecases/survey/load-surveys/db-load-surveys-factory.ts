import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys'

import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveysFactory = (): DbLoadSurveys => {
  const dbLoadSurveysRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(dbLoadSurveysRepository)
}

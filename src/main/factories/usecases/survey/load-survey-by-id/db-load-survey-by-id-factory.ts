
import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/db-load-survey-by-id'

import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyByIdFactory = (): DbLoadSurveyById => {
  const dbLoadSurveyByIdRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(dbLoadSurveyByIdRepository)
}

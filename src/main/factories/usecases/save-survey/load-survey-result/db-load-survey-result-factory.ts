import { DbLoadSurveyResult } from '@/data/usecases/survey-result/load-survey-result/db-load-survey-result'

import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { makeDbLoadSurveyByIdFactory } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'

export const makeDbLoadSurveyResultFactory = (): DbLoadSurveyResult => {
  const dbSaveSurveyResultRepository = new SurveyResultMongoRepository()
  return new DbLoadSurveyResult(dbSaveSurveyResultRepository, makeDbLoadSurveyByIdFactory())
}

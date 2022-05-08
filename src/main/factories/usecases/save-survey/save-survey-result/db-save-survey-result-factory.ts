import { DbSaveSurveyResult } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result'

import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResultFactory = (): DbSaveSurveyResult => {
  const dbSaveSurveyResultRepository = new SurveyResultMongoRepository()
  const dbLoadSurveyResultRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(dbSaveSurveyResultRepository, dbLoadSurveyResultRepository)
}

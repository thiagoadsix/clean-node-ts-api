import { DbAddSurvey } from '../../../../data/usecases/add-survey/db-add-survey'
import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurveyFactory = (): DbAddSurvey => {
  const dbAddSurveyRepository = new SurveyMongoRepository()
  return new DbAddSurvey(dbAddSurveyRepository)
}

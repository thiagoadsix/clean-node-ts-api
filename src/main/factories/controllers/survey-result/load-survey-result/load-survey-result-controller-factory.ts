import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyByIdFactory } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'
import { makeDbLoadSurveyResultFactory } from '@/main/factories/usecases/save-survey/load-survey-result/db-load-survey-result-factory'

import { Controller } from '@/presentation/protocols'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'

export const makeLoadSurveyResultControllerFactory = (): Controller => {
  const loadSurveyController = new LoadSurveyResultController(makeDbLoadSurveyByIdFactory(), makeDbLoadSurveyResultFactory())
  return makeLogControllerDecoratorFactory(loadSurveyController)
}

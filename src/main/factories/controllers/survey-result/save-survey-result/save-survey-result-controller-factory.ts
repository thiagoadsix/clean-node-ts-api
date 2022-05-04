import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbSaveSurveyResultFactory } from '@/main/factories/usecases/save-survey/save-survey-result/db-save-survey-result-factory'
import { makeDbLoadSurveyByIdFactory } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'

import { Controller } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'

export const makeSaveSurveyResultControllerFactory = (): Controller => {
  const loadSurveysController = new SaveSurveyResultController(makeDbLoadSurveyByIdFactory(), makeDbSaveSurveyResultFactory())
  return makeLogControllerDecoratorFactory(loadSurveysController)
}

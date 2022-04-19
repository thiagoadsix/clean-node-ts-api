import { Controller } from '../../../../../presentation/protocols'

import { makeLogControllerDecoratorFactory } from '../../../decorators/log-controller-decorator-factory'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { makeDbLoadSurveysFactory } from '../../../usecases/survey/load-surveys/db-load-surveys-factory'

export const makeLoadSurveysControllerFactory = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeDbLoadSurveysFactory())
  return makeLogControllerDecoratorFactory(loadSurveysController)
}

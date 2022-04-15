import { Controller } from '../../../../presentation/protocols'

import { makeLogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeDbAddSurveyFactory } from '../../usecases/add-survey/db-add-survey-factory'
import { makeAddSurveyValidationFactory } from './add-survey-validation-factory'

export const makeAddSurveyControllerFactory = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidationFactory(), makeDbAddSurveyFactory())
  return makeLogControllerDecoratorFactory(addSurveyController)
}

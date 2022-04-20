import { Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'

import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAddSurveyFactory } from '@/main/factories/usecases/survey/add-survey/db-add-survey-factory'

import { makeAddSurveyValidationFactory } from './add-survey-validation-factory'

export const makeAddSurveyControllerFactory = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidationFactory(), makeDbAddSurveyFactory())
  return makeLogControllerDecoratorFactory(addSurveyController)
}

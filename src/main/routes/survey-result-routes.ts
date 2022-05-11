import { Router } from 'express'

import { adaptRoute } from '@/main/adapters/express/express-routes.adapter'
import { auth } from '@/main/middlewares/auth'
import { makeSaveSurveyResultControllerFactory } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { makeLoadSurveyResultControllerFactory } from '@/main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultControllerFactory()))
  router.get('/surveys/:surveyId/results', auth, adaptRoute(makeLoadSurveyResultControllerFactory()))
}

import { Router } from 'express'

import { adaptRoute } from '../adapters/express/express-routes.adapter'

import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

import { makeAddSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysControllerFactory } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyControllerFactory()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysControllerFactory()))
}

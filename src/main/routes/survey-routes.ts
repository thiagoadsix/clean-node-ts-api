import { Router } from 'express'

import { adaptRoute } from '../adapters/express/express-routes.adapter'
import { adaptMiddleware } from '../adapters/express/express-middleware.adapter'

import { makeAuthMiddlewareFactory } from '../factories/middleware/auth-middleware-controller-factory'

import { makeAddSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysControllerFactory } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddlewareFactory('admin'))
  const auth = adaptMiddleware(makeAuthMiddlewareFactory())

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyControllerFactory()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysControllerFactory()))
}

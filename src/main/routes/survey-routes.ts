import { Router } from 'express'

import { adaptRoute } from '../adapters/express/express-routes.adapter'
import { adaptMiddleware } from '../adapters/express/express-middleware.adapter'

import { makeAddSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeAuthMiddlewareFactory } from '../factories/middleware/auth-middleware-controller-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddlewareFactory('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyControllerFactory()))
}

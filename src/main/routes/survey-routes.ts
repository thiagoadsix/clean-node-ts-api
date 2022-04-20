import { Router } from 'express'

import { adaptRoute } from '@/main/adapters/express/express-routes.adapter'
import { adminAuth } from '@/main/middlewares/admin-auth'
import { auth } from '@/main/middlewares/auth'
import { makeAddSurveyControllerFactory } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysControllerFactory } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyControllerFactory()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysControllerFactory()))
}

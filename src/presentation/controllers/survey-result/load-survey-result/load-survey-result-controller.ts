import { InvalidParamError } from '@/presentation/errors'
import { Controller, forbidden, HttpRequest, HttpResponse, LoadSurveyById, serverError } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {
    this.loadSurveyById = loadSurveyById
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      return Promise.resolve(null)
    } catch (error) {
      return serverError(error)
    }
  }
}

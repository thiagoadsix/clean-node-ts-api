import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {
    this.loadSurveyById = loadSurveyById
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params

    await this.loadSurveyById.loadById(surveyId)

    return Promise.resolve(null)
  }
}

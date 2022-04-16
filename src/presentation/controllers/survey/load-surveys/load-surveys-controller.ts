import { Controller, HttpRequest, HttpResponse, LoadSurveys, ok } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {
    this.loadSurveys = loadSurveys
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return ok(await this.loadSurveys.load())
  }
}

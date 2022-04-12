import {
  AddSurvey,
  badRequest,
  Controller,
  HttpRequest,
  HttpResponse,
  serverError,
  Validation
} from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {
    this.validation = validation
    this.addSurvey = addSurvey
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { question, answers } = httpRequest.body

      await this.addSurvey.add({ question, answers })
    } catch (error) {
      return serverError(error)
    }

    return {
      body: null,
      statusCode: 200
    }
  }
}

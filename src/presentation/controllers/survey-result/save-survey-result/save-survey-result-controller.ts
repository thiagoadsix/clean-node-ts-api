import { InvalidParamError } from '@/presentation/errors'
import { Controller, forbidden, HttpRequest, HttpResponse, LoadSurveyById, SaveSurveyResult, serverError } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {
    this.loadSurveyById = loadSurveyById
    this.saveSurveyResult = saveSurveyResult
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { answer } = httpRequest.body
    const { surveyId } = httpRequest.params
    const { accountId } = httpRequest

    try {
      const survey = await this.loadSurveyById.loadById(surveyId)

      if (survey) {
        const answers = survey.answers.map(({ answer }) => answer)

        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }

      await this.saveSurveyResult.save({
        surveyId,
        accountId,
        date: new Date(),
        answer
      })

      return null
    } catch (error) {
      return serverError(error)
    }
  }
}

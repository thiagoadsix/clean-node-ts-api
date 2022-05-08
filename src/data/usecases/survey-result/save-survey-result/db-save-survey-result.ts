import {
  LoadSurveyResultRepository,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {
    this.saveSurveyResultRepository = saveSurveyResultRepository
  }

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    return await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId)
  }
}

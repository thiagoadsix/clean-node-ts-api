import { SurveyModel } from '@/data/usecases/load-surveys/db-load-surveys-protocols'

export interface LoadSurveysRepository {
  loadAll: () => Promise<SurveyModel[]>
}

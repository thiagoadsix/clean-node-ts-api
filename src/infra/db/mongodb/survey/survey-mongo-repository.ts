import { MongoHelper } from '@/infra/db/helpers/mongo-helper'

import {
  AddSurveyModel,
  AddSurveyRepository,
  LoadSurveysRepository,
  SurveyModel
} from './survey-mongo-repository-protocols'

import { SurveyMapper } from './survey-mongo-repository-mapper'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    return SurveyMapper.surveysMongoToSurveysModel(surveys)
  }

  async add (surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}

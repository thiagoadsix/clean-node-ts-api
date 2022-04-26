import { ObjectId } from 'mongodb'

import { MongoHelper } from '@/infra/db/helpers/mongo-helper'

import {
  AddSurveyModel,
  AddSurveyRepository,
  LoadSurveysRepository,
  SurveyModel
} from './survey-mongo-repository-protocols'

import { SurveyMapper } from './survey-mongo-repository-mapper'
import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return SurveyMapper.surveyMongoToSurveyModel(survey)
  }

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

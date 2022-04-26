
import { MongoHelper } from '@/infra/db/helpers/mongo-helper'

import {
  SaveSurveyResultModel,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './survey-result-mongo-repository-protocols'

import { SurveyResultMapper } from './survey-result-mongo-repository-mapper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (surveyData: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const surveyResult = await surveyResultCollection.findOneAndUpdate({
      surveyId: surveyData.surveyId,
      accountId: surveyData.accountId
    }, {
      $set: {
        answer: surveyData.answer,
        date: surveyData.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })
    const resp = await surveyResultCollection.findOne({ _id: surveyResult.value._id })
    return SurveyResultMapper.surveyResultMongoToSurveyResultModel(resp)
  }
}

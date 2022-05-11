import { ObjectId } from 'mongodb'

import { MongoHelper, QueryBuilder } from '@/infra/db/helpers'

import {
  LoadSurveyResultRepository,
  SaveSurveyResultParams,
  SaveSurveyResultRepository,
  SurveyResultModel
} from './survey-result-mongo-repository-protocols'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepository {
  async save (surveyData: SaveSurveyResultParams): Promise<void> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyData.surveyId),
      accountId: new ObjectId(surveyData.accountId)
    }, {
      $set: {
        answer: surveyData.answer,
        date: surveyData.date
      }
    }, {
      upsert: true
    })
  }

  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(surveyId)
      })
      .unwind({
        path: '$answers'
      })
      .lookup({
        from: 'surveyResults',
        let: {
          id: '$_id',
          answer: '$answers.answer'
        },
        pipeline: [{
          $match: {
            $expr: {
              $and: [
                { $eq: ['$surveyId', '$$id'] },
                { $eq: ['$answer', '$$answer'] }
              ]
            }
          }
        }],
        as: 'results'
      })
      .group({
        _id: 0,
        data: {
          $push: '$$ROOT'
        },
        total: {
          $sum: {
            $size: '$results'
          }
        }
      })
      .unwind({
        path: '$data'
      })
      .addFields({
        count: {
          $size: '$data.results'
        },
        percent: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            {
              $multiply: [{
                $divide: [{ $size: '$data.results' }, '$total']
              }, 100]
            }
          ]
        }
      })
      .sort({ count: -1 })
      .project({
        _id: 0,
        surveyId: '$data._id',
        question: '$data.question',
        date: '$data.date',
        answers: {
          image: '$data.answers.image',
          answer: '$data.answers.answer',
          count: '$count',
          percent: '$percent'
        }
      })
      .group({
        _id: {
          surveyId: '$surveyId',
          question: '$question',
          date: '$date'
        },
        answers: {
          $push: '$answers'
        }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'

      })
      .build()
    const surveyResultQuery = await surveyCollection.aggregate<SurveyResultModel>(query).toArray()
    return surveyResultQuery?.length ? surveyResultQuery[0] : null
  }
}

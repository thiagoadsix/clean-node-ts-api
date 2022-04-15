import { Collection } from 'mongodb'

import { MongoHelper } from '../../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Survey MongoDB Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  test('should create a survey on success', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any question',
      answers: [{
        image: 'any image',
        answer: 'any answer'
      }, {
        answer: 'other answer'
      }]
    })

    const survey = await surveyCollection.findOne({ question: 'any question' })

    expect(survey).toBeTruthy()
  })
})

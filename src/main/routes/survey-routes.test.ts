import { Collection } from 'mongodb'
import request from 'supertest'

import { MongoHelper } from '../../infra/db/helpers/mongo-helper'

import app from '../config/app'

let surveyCollection: Collection

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('should return 204 on create a survey on success', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any question',
          answers: [{
            image: 'any image',
            answer: 'any answer'
          }, {
            answer: 'any other answer'
          }]
        })
        .expect(204)
    })
  })
})

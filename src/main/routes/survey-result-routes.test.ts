import request from 'supertest'

import { MongoHelper } from '@/infra/db/helpers/mongo-helper'

import app from '@/main/config/app'

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /surveys/:surveyId/results', () => {
    test('should return 403 on save survey with out access', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any answer'
        })
        .expect(403)
    })
  })
})

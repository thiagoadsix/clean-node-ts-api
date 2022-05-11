import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'

import { MongoHelper } from '@/infra/db/helpers/mongo-helper'

import app from '@/main/config/app'
import env from '@/main/config/env'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const password = await hash('123456789', 12)
  const result = await accountCollection.insertOne({
    name: 'Some Name',
    email: 'some@example.com',
    password
  })
  const account = await accountCollection.findOne(result.insertedId)
  const accountId = account._id
  const accessToken = sign({ id: accountId }, env.jwtSecret)
  await accountCollection.updateOne(
    { _id: accountId }
    ,
    {
      $set: {
        accessToken
      }
    }
  )

  return accessToken
}

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
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('should return 403 on save survey with out access', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any answer'
        })
        .expect(403)
    })

    test('should return 200 on save survey with token', async () => {
      const accessToken = await makeAccessToken()
      const res = await surveyCollection.insertOne({
        question: 'any question',
        answers: [{
          image: 'any image',
          answer: 'any answer'
        }, {
          answer: 'any other answer'
        }],
        date: new Date()
      })
      await request(app)
        .put(`/api/surveys/${res.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any answer'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('should return 403 on load survey with out access', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })
  })
})
